import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  familySize: z.string().min(1, "Please select your family size"),
  interests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      familySize: "",
      interests: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/waitlist", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setErrorMessage("");
    },
    onError: (error: any) => {
      const errorText = error?.message || "Failed to join waitlist. Please try again.";
      // Extract the error message from the response if available
      try {
        const match = errorText.match(/\d+:\s*({.*})/);
        if (match) {
          const errorJson = JSON.parse(match[1]);
          setErrorMessage(errorJson.error || errorText);
        } else {
          setErrorMessage(errorText);
        }
      } catch {
        setErrorMessage(errorText);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    setErrorMessage("");
    mutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-4" data-testid="success-message">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">You're on the list!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thanks for joining the waitlist. We'll be in touch soon with exclusive early access to Envis.
        </p>
        <p className="text-sm text-muted-foreground">
          Expected launch: Feb 2026
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Smith"
                    {...field}
                    data-testid="input-name"
                  />
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    data-testid="input-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="familySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-family-size">
                    <SelectValue placeholder="Select your family size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5+">5+ people</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What interests you most about Envis? (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you're hoping to achieve with Envis..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  data-testid="input-interests"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive" data-testid="error-message">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={mutation.isPending}
          data-testid="button-submit-waitlist"
        >
          {mutation.isPending ? "Submitting..." : "Request Early Access"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By joining, you agree to receive updates about Envis. We respect your privacy and will never share your data.
        </p>
      </form>
    </Form>
  );
}
