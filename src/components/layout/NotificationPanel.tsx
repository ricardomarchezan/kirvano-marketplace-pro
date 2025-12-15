import { Bell, Check, X, UserPlus, TrendingUp } from "lucide-react";
import { useNotification, Notification } from "@/contexts/NotificationContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const notificationIcons: Record<string, typeof Bell> = {
  affiliation_request: UserPlus,
  affiliation_approved: Check,
  affiliation_rejected: X,
  new_sale: TrendingUp,
  new_referral: UserPlus,
};

export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotification();
  const { refreshData } = useData();

  const handleApproveAffiliation = async (notification: Notification) => {
    try {
      // Update affiliation status in database
      if (notification.data?.affiliation_id) {
        const { error } = await supabase
          .from('affiliations')
          .update({ status: 'approved' })
          .eq('id', notification.data.affiliation_id);
        
        if (error) throw error;
      }

      // Create approval notification for the affiliate
      if (notification.data?.affiliate_id) {
        addNotification({
          user_id: notification.data.affiliate_id,
          type: 'affiliation_approved',
          title: 'Afiliação Aprovada!',
          message: `Sua solicitação de afiliação ao produto "${notification.data.product_name}" foi aprovada! Você já pode começar a promover.`,
          data: {
            product_id: notification.data.product_id,
            product_name: notification.data.product_name,
          },
          read: false,
        });
      }

      markAsRead(notification.id);
      await refreshData();

      toast({
        title: "Afiliado aprovado!",
        description: `${notification.data?.affiliate_name} foi aprovado como afiliado.`,
      });
    } catch (error) {
      console.error('Error approving affiliation:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a afiliação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRejectAffiliation = async (notification: Notification) => {
    try {
      // Update affiliation status in database
      if (notification.data?.affiliation_id) {
        const { error } = await supabase
          .from('affiliations')
          .update({ status: 'rejected' })
          .eq('id', notification.data.affiliation_id);
        
        if (error) throw error;
      }

      // Create rejection notification for the affiliate
      if (notification.data?.affiliate_id) {
        addNotification({
          user_id: notification.data.affiliate_id,
          type: 'affiliation_rejected',
          title: 'Afiliação Recusada',
          message: `Sua solicitação de afiliação ao produto "${notification.data.product_name}" foi recusada pelo produtor.`,
          data: {
            product_id: notification.data.product_id,
            product_name: notification.data.product_name,
          },
          read: false,
        });
      }

      markAsRead(notification.id);
      await refreshData();

      toast({
        title: "Afiliado recusado",
        description: `A solicitação de ${notification.data?.affiliate_name} foi recusada.`,
      });
    } catch (error) {
      console.error('Error rejecting affiliation:', error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar a afiliação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-all active:scale-95">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full animate-ping opacity-75" />
            </>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[420px] p-0 bg-card border-border" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Notificações</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground text-center">
                Nenhuma notificação ainda
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Você será notificado sobre atividades importantes
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                const isAffiliationRequest = notification.type === 'affiliation_request';
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-secondary/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => !isAffiliationRequest && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      )}
                      
                      {/* Icon */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        notification.type === 'affiliation_request' ? 'bg-warning/10' :
                        notification.type === 'affiliation_approved' ? 'bg-success/10' :
                        notification.type === 'affiliation_rejected' ? 'bg-destructive/10' :
                        notification.type === 'new_sale' ? 'bg-success/10' :
                        'bg-primary/10'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          notification.type === 'affiliation_request' ? 'text-warning' :
                          notification.type === 'affiliation_approved' ? 'text-success' :
                          notification.type === 'affiliation_rejected' ? 'text-destructive' :
                          notification.type === 'new_sale' ? 'text-success' :
                          'text-primary'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        {/* Action buttons for affiliation requests */}
                        {isAffiliationRequest && !notification.read && (
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveAffiliation(notification);
                              }}
                              className="h-7 text-xs bg-success hover:bg-success/90"
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectAffiliation(notification);
                              }}
                              className="h-7 text-xs"
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
