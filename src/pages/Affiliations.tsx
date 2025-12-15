import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Affiliations = () => {
  const { affiliations, sales, allProducts } = useData();

  // Filter only approved affiliations
  const approvedAffiliations = affiliations.filter(a => a.status === 'approved');

  // Get product details and calculate sales for each affiliation
  const affiliationData = approvedAffiliations.map(affiliation => {
    const product = allProducts.find(p => p.id === affiliation.product_id);
    const affiliateSales = sales.filter(
      s => s.product_id === affiliation.product_id && s.affiliate_id === affiliation.user_id
    );
    const totalSales = affiliateSales.length;
    const totalRevenue = affiliateSales.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalCommission = affiliateSales.reduce((sum, s) => sum + Number(s.commission_amount), 0);

    return {
      ...affiliation,
      product,
      totalSales,
      totalRevenue,
      totalCommission,
    };
  });

  // Calculate totals
  const totals = affiliationData.reduce(
    (acc, aff) => ({
      products: acc.products + 1,
      sales: acc.sales + aff.totalSales,
      revenue: acc.revenue + aff.totalRevenue,
      commission: acc.commission + aff.totalCommission,
    }),
    { products: 0, sales: 0, revenue: 0, commission: 0 }
  );

  const copyAffiliateLink = (referralCode: string, productName: string) => {
    const link = `${window.location.origin}/p?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: `Link de afiliado para "${productName}" copiado para a área de transferência.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Afiliações</h1>
          <p className="text-muted-foreground mt-1">
            Produtos que você está promovendo como afiliado
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Produtos Afiliados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{totals.products}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Vendas Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{totals.sales}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-warning" />
                Receita Gerada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                R$ {totals.revenue.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" />
                Comissão Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">
                R$ {totals.commission.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Affiliations List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Produtos Ativos</h2>
          
          {affiliationData.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Nenhuma afiliação ativa
                </p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Visite o Marketplace para encontrar produtos e solicitar afiliação. 
                  Após aprovação, seus produtos aparecerão aqui.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => window.location.href = '/marketplace'}
                >
                  Ir para o Marketplace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affiliationData.map((affiliation) => (
                <Card key={affiliation.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground truncate">
                          {affiliation.product?.name || 'Produto'}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Afiliado desde {new Date(affiliation.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-success/10 text-success border-0 flex-shrink-0">
                        Ativo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-lg font-bold text-foreground">{affiliation.totalSales}</p>
                        <p className="text-xs text-muted-foreground">Vendas</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-lg font-bold text-foreground">
                          R$ {affiliation.totalRevenue.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Receita</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-success/10">
                        <p className="text-lg font-bold text-success">
                          R$ {affiliation.totalCommission.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Comissão</p>
                      </div>
                    </div>

                    {/* Commission Rate */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de Comissão</span>
                      <span className="font-medium text-foreground">
                        {affiliation.product?.commission || 0}%
                      </span>
                    </div>

                    {/* Affiliate Link */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        Seu link de afiliado
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 text-xs bg-secondary/50 p-2 rounded truncate">
                          {`${window.location.origin}/p?ref=${affiliation.referral_code}`}
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyAffiliateLink(affiliation.referral_code, affiliation.product?.name || 'Produto')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* View Product */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.location.href = `/marketplace?product=${affiliation.product_id}`}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Ver Produto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pending Affiliations */}
        {affiliations.filter(a => a.status === 'pending').length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Solicitações Pendentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affiliations
                .filter(a => a.status === 'pending')
                .map(affiliation => {
                  const product = allProducts.find(p => p.id === affiliation.product_id);
                  return (
                    <Card key={affiliation.id} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-semibold text-foreground">
                            {product?.name || 'Produto'}
                          </CardTitle>
                          <Badge variant="outline" className="border-warning text-warning">
                            Pendente
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Solicitado em {new Date(affiliation.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Aguardando aprovação do produtor
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Rejected Affiliations */}
        {affiliations.filter(a => a.status === 'rejected').length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Afiliações Recusadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affiliations
                .filter(a => a.status === 'rejected')
                .map(affiliation => {
                  const product = allProducts.find(p => p.id === affiliation.product_id);
                  return (
                    <Card key={affiliation.id} className="bg-card border-border opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-semibold text-foreground">
                            {product?.name || 'Produto'}
                          </CardTitle>
                          <Badge variant="outline" className="border-destructive text-destructive">
                            Recusada
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Solicitado em {new Date(affiliation.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          O produtor recusou sua solicitação de afiliação
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Affiliations;
