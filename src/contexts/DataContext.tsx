import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  price: number;
  commission: number;
  model: "recurring" | "whitelabel";
  status: "active" | "paused";
  image_url: string | null;
  video_url: string | null;
  webhook_url: string | null;
  github_url: string | null;
  auto_approve_affiliates: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  producer_id: string;
  affiliate_id: string | null;
  customer_email: string;
  customer_name: string | null;
  amount: number;
  commission_amount: number;
  status: "completed" | "pending" | "refunded" | "chargeback";
  created_at: string;
  product?: Product;
}

export interface Transaction {
  id: string;
  user_id: string;
  sale_id: string | null;
  type: "credit" | "debit" | "refund" | "withdrawal";
  description: string;
  amount: number;
  status: "completed" | "pending";
  created_at: string;
}

export interface Affiliation {
  id: string;
  user_id: string;
  product_id: string;
  status: "pending" | "approved" | "rejected";
  referral_code: string;
  created_at: string;
  product?: Product;
}

export interface Metrics {
  mrr: number;
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  activeClients: number;
  churnRate: number;
  totalWithdrawn: number;
  ltv: number;
}

interface DataContextType {
  products: Product[];
  sales: Sale[];
  transactions: Transaction[];
  affiliations: Affiliation[];
  allProducts: Product[];
  metrics: Metrics;
  loading: boolean;
  addProduct: (data: Omit<Product, "id" | "owner_id" | "created_at" | "updated_at">) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  requestAffiliation: (productId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultMetrics: Metrics = {
  mrr: 0,
  totalRevenue: 0,
  availableBalance: 0,
  pendingBalance: 0,
  activeClients: 0,
  churnRate: 0,
  totalWithdrawn: 0,
  ltv: 0,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);
  const [loading, setLoading] = useState(true);

  const calculateMetrics = useCallback((
    userSales: Sale[],
    userTransactions: Transaction[],
    userProducts: Product[]
  ): Metrics => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // MRR from recurring products
    const mrr = userSales
      .filter(s => s.status === "completed")
      .reduce((sum, sale) => {
        const product = userProducts.find(p => p.id === sale.product_id);
        if (product?.model === "recurring") {
          return sum + Number(sale.amount);
        }
        return sum;
      }, 0);

    // Total revenue
    const totalRevenue = userSales
      .filter(s => s.status === "completed")
      .reduce((sum, sale) => sum + Number(sale.amount), 0);

    // Available balance (completed credits older than 14 days)
    const availableBalance = userTransactions
      .filter(t => 
        t.type === "credit" && 
        t.status === "completed" &&
        new Date(t.created_at) < fourteenDaysAgo
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Pending balance (completed credits less than 14 days)
    const pendingBalance = userTransactions
      .filter(t => 
        t.type === "credit" && 
        t.status === "completed" &&
        new Date(t.created_at) >= fourteenDaysAgo
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Active clients (unique customer emails with completed sales)
    const activeClients = new Set(
      userSales
        .filter(s => s.status === "completed")
        .map(s => s.customer_email)
    ).size;

    // Total withdrawn
    const totalWithdrawn = userTransactions
      .filter(t => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // LTV (average revenue per customer)
    const ltv = activeClients > 0 ? totalRevenue / activeClients : 0;

    // Churn rate (simplified - refunds / total sales)
    const refundedCount = userSales.filter(s => s.status === "refunded" || s.status === "chargeback").length;
    const totalSalesCount = userSales.length;
    const churnRate = totalSalesCount > 0 ? (refundedCount / totalSalesCount) * 100 : 0;

    return {
      mrr,
      totalRevenue,
      availableBalance,
      pendingBalance,
      activeClients,
      churnRate,
      totalWithdrawn,
      ltv,
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setSales([]);
      setTransactions([]);
      setAffiliations([]);
      setAllProducts([]);
      setMetrics(defaultMetrics);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch user's products
      const { data: userProducts, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch all products for marketplace
      const { data: allProds, error: allProdsError } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (allProdsError) throw allProdsError;

      // Fetch user's sales (as producer or affiliate)
      const { data: userSales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (salesError) throw salesError;

      // Fetch user's transactions
      const { data: userTransactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch user's affiliations
      const { data: userAffiliations, error: affiliationsError } = await supabase
        .from("affiliations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (affiliationsError) throw affiliationsError;

      const typedProducts = (userProducts || []) as Product[];
      const typedAllProducts = (allProds || []) as Product[];
      const typedSales = (userSales || []) as Sale[];
      const typedTransactions = (userTransactions || []) as Transaction[];
      const typedAffiliations = (userAffiliations || []) as Affiliation[];

      setProducts(typedProducts);
      setAllProducts(typedAllProducts);
      setSales(typedSales);
      setTransactions(typedTransactions);
      setAffiliations(typedAffiliations);
      setMetrics(calculateMetrics(typedSales, typedTransactions, typedProducts));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, calculateMetrics]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProduct = async (data: Omit<Product, "id" | "owner_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("products")
        .insert({
          ...data,
          owner_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Produto cadastrado!",
        description: "Seu produto foi cadastrado com sucesso.",
      });

      await fetchData();
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Erro ao cadastrar produto",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) throw error;

      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas.",
      });

      await fetchData();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) throw error;

      toast({
        title: "Produto removido!",
        description: "O produto foi excluído com sucesso.",
      });

      await fetchData();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const generateReferralCode = (userId: string, productId: string) => {
    const timestamp = Date.now().toString(36);
    const userPart = userId.slice(0, 8);
    const productPart = productId.slice(0, 8);
    return `${userPart}-${productPart}-${timestamp}`;
  };

  const requestAffiliation = async (productId: string) => {
    if (!user) return;

    try {
      // Check if already affiliated
      const existing = affiliations.find(a => a.product_id === productId);
      if (existing) {
        toast({
          title: "Já afiliado",
          description: "Você já solicitou afiliação para este produto.",
        });
        return;
      }

      const referralCode = generateReferralCode(user.id, productId);

      // Check if product has auto-approve
      const product = allProducts.find(p => p.id === productId);
      const status = product?.auto_approve_affiliates ? "approved" : "pending";

      const { error } = await supabase
        .from("affiliations")
        .insert({
          user_id: user.id,
          product_id: productId,
          referral_code: referralCode,
          status,
        });

      if (error) throw error;

      toast({
        title: status === "approved" ? "Afiliação aprovada!" : "Solicitação enviada!",
        description: status === "approved" 
          ? "Você já pode promover este produto."
          : "Aguarde a aprovação do produtor.",
      });

      await fetchData();
    } catch (error: any) {
      console.error("Error requesting affiliation:", error);
      toast({
        title: "Erro ao solicitar afiliação",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        sales,
        transactions,
        affiliations,
        allProducts,
        metrics,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        requestAffiliation,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
