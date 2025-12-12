import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, Phone, FileText, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }).max(100),
  email: z.string().trim().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string(),
  cpf_cnpj: z.string().optional(),
  phone: z.string().optional(),
  acceptTerms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
}).refine((data) => data.acceptTerms === true, {
  message: 'Você deve aceitar os termos de uso',
  path: ['acceptTerms'],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Cadastro() {
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf_cnpj: '',
    phone: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});

  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (field: keyof SignupForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const { error } = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      cpf_cnpj: formData.cpf_cnpj,
      phone: formData.phone,
    });

    if (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message === 'User already registered'
          ? 'Este email já está cadastrado'
          : error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'Conta criada!',
      description: 'Sua conta foi criada com sucesso.',
    });

    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>Preencha os dados para começar</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="cpf_cnpj"
                    placeholder="000.000.000-00"
                    value={formData.cpf_cnpj}
                    onChange={(e) => handleChange('cpf_cnpj', e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleChange('acceptTerms', checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
                Aceito os{' '}
                <a href="#" className="text-primary hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
              </Label>
            </div>
            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
