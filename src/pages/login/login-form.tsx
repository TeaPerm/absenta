import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";

const formSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Érvényes email címet kell megadni" })
      .min(1, { message: "Az email mező nem lehet üres" }),
    password: z
      .string()
      .min(8, {
        message: "A jelszónak legalább 8 karakter hosszúnak kell lennie",
      }),
  })
  .required();

export function LoginForm() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (loginData: typeof formSchema._type) => {
      return axios.post(`${API_URL}/auth/login`, loginData);
    },
    onError: (err: { response: { data: { message: string } } }) => {
      const errors = err.response.data;
      console.log(errors);
      form.setError("root", { message: errors.message });
    },
    onSuccess: async (response) => {
      console.log(response);
      signIn(response.data.token);
      navigate("/");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    console.log(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Szervusz!</h1>
                  <p className="text-balance text-muted-foreground">
                    Lépj be az{" "}
                    <span className="text-primary font-bold">
                      <a
                        onClick={() => {navigate("/")}}
                        className="hover:underline cursor-pointer"
                      >
                        Abesent
                      <span className="text-primary/60">a</span>
                      </a>
                    </span>{" "}
                    fiókodba
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Jelszó</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <Button type="submit" className="w-full">
                  Belépés
                </Button>
                {form.formState.errors.root && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <div className="text-center text-sm">
                  Nincs fiókod?{" "}
                  <Link
                    to="/register"
                    className="font-bold underline underline-offset-4 hover:text-primary/60"
                  >
                    Regisztráció
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="items-center object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
