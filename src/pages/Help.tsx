import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Book,
  MessageCircle,
  Video,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const resources = [
  {
    icon: Book,
    title: "Documentação",
    description: "Guias completos e tutoriais",
    link: "#",
    color: "primary",
  },
  {
    icon: Video,
    title: "Vídeo Aulas",
    description: "Aprenda com conteúdo em vídeo",
    link: "#",
    color: "success",
  },
  {
    icon: MessageCircle,
    title: "Chat ao Vivo",
    description: "Fale com nossa equipe",
    link: "#",
    color: "warning",
  },
  {
    icon: FileText,
    title: "FAQ",
    description: "Perguntas frequentes",
    link: "#",
    color: "destructive",
  },
];

const articles = [
  {
    title: "Como começar a promover produtos",
    category: "Primeiros Passos",
  },
  {
    title: "Configurando seu primeiro webhook",
    category: "Integrações",
  },
  {
    title: "Entendendo comissões e pagamentos",
    category: "Finanças",
  },
  {
    title: "Melhores práticas para afiliados",
    category: "Marketing",
  },
  {
    title: "Como cadastrar seu SaaS na plataforma",
    category: "Produtores",
  },
];

const Help = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Como podemos ajudar?</h1>
          <p className="text-muted-foreground mt-2">
            Encontre respostas, tutoriais e suporte para suas dúvidas
          </p>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos, tutoriais..."
              className="pl-12 py-6 text-lg bg-secondary border-border"
            />
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-${resource.color}/10 flex items-center justify-center mb-4`}
              >
                <resource.icon className={`w-6 h-6 text-${resource.color}`} />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
            </div>
          ))}
        </div>

        {/* Articles */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Artigos Populares</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Ver todos
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-2">
            {articles.map((article) => (
              <div
                key={article.title}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary transition-colors cursor-pointer group"
              >
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.category}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Não encontrou o que procurava?
          </h2>
          <p className="text-muted-foreground mb-4">
            Nossa equipe de suporte está pronta para ajudar
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            <MessageCircle className="w-4 h-4 mr-2" />
            Iniciar Conversa
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
