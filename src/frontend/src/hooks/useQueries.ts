import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      network: string;
      bundle: string;
      price: string;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        params.network,
        params.bundle,
        params.price,
        params.phoneNumber,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateStripeCheckout() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      network: string;
      bundle: string;
      price: string;
      phoneNumber: string;
    }): Promise<string> => {
      if (!actor) throw new Error("Not connected");

      const base = `${window.location.origin}${window.location.pathname}`;
      const successUrl = `${base}?payment=success`;
      const cancelUrl = `${base}?payment=cancelled`;

      // Convert GHC price string (e.g. "₵6") to pesewas (1 GHC = 100 pesewas)
      const priceNumeric = Number.parseFloat(
        params.price.replace(/[^0-9.]/g, ""),
      );
      const priceInCents = BigInt(Math.round(priceNumeric * 100));

      const items = [
        {
          currency: "ghc",
          productName: `${params.network} ${params.bundle} Data Bundle`,
          productDescription: `Mobile data bundle for ${params.phoneNumber} on ${params.network}`,
          priceInCents,
          quantity: BigInt(1),
        },
      ];

      // Cast to any because createCheckoutSession is injected by the Stripe backend component
      // and is not present in the auto-generated backendInterface
      const stripeActor = actor as any;
      if (typeof stripeActor.createCheckoutSession !== "function") {
        throw new Error(
          "Stripe checkout is not available. Please try MoMo payment.",
        );
      }

      const resultJson: string = await stripeActor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );

      const session = JSON.parse(resultJson) as { id?: string; url?: string };
      if (!session.url) {
        throw new Error(
          "Stripe did not return a checkout URL. Please try again.",
        );
      }

      return session.url;
    },
  });
}
