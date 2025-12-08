import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Eye, EyeOff, RefreshCw, Webhook, Code2, Facebook, Chrome } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Integrations = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "sk_live_abc123def456ghi789jkl012mno345pqr678stu901";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Configure pixels, webhooks e chaves de API
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pixels */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pixels de Rastreamento</h2>
                <p className="text-sm text-muted-foreground">Configure seus pixels de marketing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                    <span className="font-medium text-foreground">Facebook Pixel</span>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-pixel" className="text-muted-foreground text-xs">
                    Pixel ID
                  </Label>
                  <Input
                    id="fb-pixel"
                    placeholder="123456789012345"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Chrome className="w-5 h-5 text-[#4285F4]" />
                    <span className="font-medium text-foreground">Google Analytics</span>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ga-id" className="text-muted-foreground text-xs">
                    Measurement ID
                  </Label>
                  <Input
                    id="ga-id"
                    placeholder="G-XXXXXXXXXX"
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-warning/10">
                <Code2 className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Chave de API</h2>
                <p className="text-sm text-muted-foreground">
                  Use para comunicação server-to-server
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <Label className="text-muted-foreground text-xs mb-2 block">
                  Chave Secreta
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={showApiKey ? apiKey : "•".repeat(40)}
                    readOnly
                    className="bg-background border-border font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="flex-shrink-0"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(apiKey, "Chave de API")}
                    className="flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full border-border">
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Nova Chave
              </Button>

              <p className="text-xs text-muted-foreground">
                ⚠️ Mantenha sua chave segura. Não compartilhe publicamente.
              </p>
            </div>
          </div>

          {/* Webhooks */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-success/10">
                <Webhook className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Webhooks / Postback</h2>
                <p className="text-sm text-muted-foreground">
                  Receba notificações em tempo real
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">URL de Postback - Vendas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://seusite.com/api/webhook/sales"
                    className="bg-secondary border-border"
                  />
                  <Button variant="outline" className="border-border flex-shrink-0">
                    Testar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">URL de Postback - Chargebacks</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://seusite.com/api/webhook/chargebacks"
                    className="bg-secondary border-border"
                  />
                  <Button variant="outline" className="border-border flex-shrink-0">
                    Testar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">URL de Postback - Cancelamentos</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://seusite.com/api/webhook/cancellations"
                    className="bg-secondary border-border"
                  />
                  <Button variant="outline" className="border-border flex-shrink-0">
                    Testar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">URL de Postback - Renovações</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://seusite.com/api/webhook/renewals"
                    className="bg-secondary border-border"
                  />
                  <Button variant="outline" className="border-border flex-shrink-0">
                    Testar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
              <h3 className="font-medium text-foreground mb-2">Exemplo de Payload</h3>
              <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg overflow-x-auto">
{`{
  "event": "sale.completed",
  "transaction_id": "txn_abc123",
  "product_id": "prod_456",
  "amount": 197.00,
  "commission": 59.10,
  "customer_email": "cliente@email.com",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
