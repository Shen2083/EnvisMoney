import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  familySize: z.string().min(1, "Please select your family size"),
  interests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      familySize: "",
      interests: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Waitlist signup:", data);
    setIsSubmitted(true);
    //todo: remove mock functionality - integrate with backend API
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-4" data-testid="success-message">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">You're on the list!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thanks for joining our waiting list. We'll be in touch soon with exclusive early access to Envis.
        </p>
        <p className="text-sm text-muted-foreground">
          Expected launch: Q2 2025
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          data-testid="button-submit-waitlist"
        >
          Join the Waiting List
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By joining, you agree to receive updates about Envis. We respect your privacy and will never share your data.
        </p>
      </form>
    </Form>
  );
}
