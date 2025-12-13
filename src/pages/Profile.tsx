import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, IdCard, Calendar, Save, Package, TrendingUp, Users, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { products, sales, affiliations, loading } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
  });

  const getInitials = () => {
    if (profile?.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.name.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
    });
    setIsEditing(false);
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const stats = {
    totalProducts: products.length,
    totalSales: sales.length,
    activeAffiliations: affiliations.filter(a => a.status === "approved").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* Profile Header */}
        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-foreground">{profile?.name || "Usuário"}</h2>
              <p className="text-muted-foreground">{profile?.email || user?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Membro desde {memberSince}
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-secondary border-border opacity-75"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="bg-secondary border-border"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  CPF/CNPJ
                </Label>
                <Input
                  id="cpf"
                  value={profile?.cpf_cnpj || ""}
                  disabled
                  className="bg-secondary border-border opacity-75"
                />
                <p className="text-xs text-muted-foreground">
                  CPF/CNPJ não pode ser alterado
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-primary" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Alterações
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Estatísticas da Conta
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Produtos Cadastrados</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-sm text-muted-foreground">Total de Vendas</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-warning" />
                  <p className="text-sm text-muted-foreground">Afiliações Ativas</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.activeAffiliations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
