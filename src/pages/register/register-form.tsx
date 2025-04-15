import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UniversityCombobox } from "./university-combobox";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "A név mező nem lehet üres" }),
    email: z
      .string()
      .min(1, { message: "Az email mező nem lehet üres" })
      .email({ message: "Érvényes email címet kell megadni" }),
    password: z.string().min(8, {
      message: "A jelszónak legalább 8 karakter hosszúnak kell lennie",
    }),
    password_again: z.string().min(8, {
      message: "A jelszónak legalább 8 karakter hosszúnak kell lennie",
    }),
    university: z
      .string()
      .min(1, { message: "Legalább egy egyetemet ki kell választani" }),
  })
  .refine((data) => data.password === data.password_again, {
    message: "A jelszavaknak egyezniük kell",
    path: ["password_again"],
  });

const RegisterForm = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_again: "",
      university: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (registerData: typeof formSchema._type) => {
      const dataToSend = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        university: [registerData.university],
      };
      return axios.post(`${API_URL}/auth/register`, dataToSend);
    },
    onError: (err: { response: { data: { message: string } } }) => {
      const errors = err.response.data;
      console.log(errors);
      form.setError("root", { message: errors.message });
    },
    onSuccess: (response) => {
      console.log(response);
      signIn(response.data.token);
      navigate("/dashboard");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
          <Card>
            <CardHeader className="text-center">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Hozz létre egy fiókot
              </h2>
              <CardDescription>
                Van már fiókod?{" "}
                <Link
                  className="text-primary hover:underline underline-offset-4"
                  to="/login"
                >
                  Lépj be
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teljes név</FormLabel>
                        <FormControl>
                          <Input placeholder="absenta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email-cím</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="absent@a.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Jelszó</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_again"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Jelszó újra</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <div className="col-span-2 flex gap-2">
                        <UniversityCombobox field={field} />
                        <FormMessage />
                      </div>
                    )}
                  />
                  <Button type="submit" className="mt-3 col-span-2">
                    Regisztráció
                  </Button>
                  {form.formState.errors.root && (
                    <p className="text-red-500 mt-2 col-span-2">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;