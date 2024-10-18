"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormInputs {
  email: string;
  contraseña: string;
}

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data); // Muestra los datos que envías en la consola
    try {
      const response = await fetch('/api/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email, // Cambia a "email"
          contraseña: data.contraseña, // Contraseña enviada como está
        }),
        
      });
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }
      toast({
        title: 'Login exitoso',
        description: 'Bienvenido de nuevo!',
        variant: 'default',
      });
  
      router.push('/');
  
    } catch (error) {
      toast({
        title: 'Error de inicio de sesión',
        description: error instanceof Error ? error.message : 'Hubo un error al iniciar sesión',
        variant: 'destructive',
      });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md shadow-2xl shadow-purple-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Bienvenido</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 bg-gray-50 border-gray-200 focus:border-black transition-colors"
                id="email"
                placeholder="Correo electrónico"
                type="email"
                {...register('email', { required: 'El correo es obligatorio' })}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div className="relative mt-4">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
              className="pl-10 bg-gray-50 border-gray-200 focus:border-black transition-colors"
              id="contraseña"
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              {...register('contraseña', { required: 'La contraseña es obligatoria' })}
              />
              <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.contraseña && <span className="text-red-500">{errors.contraseña.message}</span>}
            </div>
            <CardFooter className="flex flex-col space-y-4 mt-6">
              <Link href="/">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-800 text-white transition-colors">
                Iniciar sesión
              </Button>
              </Link>
              <div className="text-sm text-center text-gray-500">
                ¿No tienes una cuenta?{" "}
                <a href="#" className="text-black hover:underline">
                  Regístrate
                </a>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
