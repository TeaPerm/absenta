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
                      Abesent<span className="text-primary/60">a</span>
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
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    vagy jelentkezz be
                  </span>
                </div>
                <div className="">
                  <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <svg
                        className="w-4 h-auto mr-2"
                        width={24}
                        height={24}
                        viewBox="0 0 46 47"
                        fill="none"
                      >
                        <path
                          d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                          fill="#34A853"
                        />
                        <path
                          d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                          fill="#EB4335"
                        />
                      </svg>
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Nincs fiókod?{" "}
                  <Link
                    to="/register"
                    className="underline underline-offset-4 hover:text-primary/60"
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
