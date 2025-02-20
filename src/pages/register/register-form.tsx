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
import { Separator } from "@/components/ui/separator";
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
              <Button className="w-full" variant={"outline"}>
                <svg
                  className="w-4 h-auto mr-2"
                  width={46}
                  height={47}
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
                Jelentkezz be Google-fiókkal
              </Button>
              <div className="relative">
                <Separator asChild className="my-3 bg-background">
                  <div className="py-3 flex items-center text-xs text-muted-foreground uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700">
                    Vagy
                  </div>
                </Separator>
              </div>
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
                            placeholder="****"
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
                            placeholder="*****"
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