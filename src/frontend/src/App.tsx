import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateStripeCheckout, usePlaceOrder } from "./hooks/useQueries";

const queryClient = new QueryClient();

const NETWORKS = [
  {
    id: "MTN",
    label: "MTN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg",
    labelColor: "text-gray-800",
  },
  {
    id: "Telecel",
    label: "Telecel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Vodafone_Logo.svg",
    labelColor: "text-red-600",
  },
  {
    id: "AT",
    label: "AT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/AirtelTigo_logo.png",
    labelColor: "text-blue-600",
  },
];

const MTN_BUNDLES = [
  { label: "1GB", price: "6", display: "1GB — GH₵ 6" },
  { label: "2GB", price: "12", display: "2GB — GH₵ 12" },
  { label: "3GB", price: "16", display: "3GB — GH₵ 16" },
  { label: "4GB", price: "22", display: "4GB — GH₵ 22" },
  { label: "5GB", price: "27", display: "5GB — GH₵ 27" },
  { label: "6GB", price: "30", display: "6GB — GH₵ 30" },
  { label: "7GB", price: "36", display: "7GB — GH₵ 36" },
  { label: "8GB", price: "41", display: "8GB — GH₵ 41" },
  { label: "10GB", price: "47", display: "10GB — GH₵ 47" },
  { label: "15GB", price: "66", display: "15GB — GH₵ 66" },
  { label: "20GB", price: "85", display: "20GB — GH₵ 85" },
  { label: "25GB", price: "115", display: "25GB — GH₵ 115" },
  { label: "30GB", price: "130", display: "30GB — GH₵ 130" },
  { label: "40GB", price: "170", display: "40GB — GH₵ 170" },
  { label: "50GB", price: "220", display: "50GB — GH₵ 220" },
  { label: "100GB", price: "405", display: "100GB — GH₵ 405" },
];

const TELECEL_BUNDLES = [
  { label: "2GB", price: "12", display: "2GB — GH₵ 12" },
  { label: "3GB", price: "15", display: "3GB — GH₵ 15" },
  { label: "4GB", price: "18", display: "4GB — GH₵ 18" },
  { label: "5GB", price: "26", display: "5GB — GH₵ 26" },
  { label: "10GB", price: "45", display: "10GB — GH₵ 45" },
  { label: "15GB", price: "65", display: "15GB — GH₵ 65" },
  { label: "20GB", price: "85", display: "20GB — GH₵ 85" },
  { label: "25GB", price: "100", display: "25GB — GH₵ 100" },
  { label: "30GB", price: "120", display: "30GB — GH₵ 120" },
  { label: "35GB", price: "135", display: "35GB — GH₵ 135" },
  { label: "40GB", price: "155", display: "40GB — GH₵ 155" },
  { label: "45GB", price: "175", display: "45GB — GH₵ 175" },
  { label: "50GB", price: "190", display: "50GB — GH₵ 190" },
  { label: "100GB", price: "380", display: "100GB — GH₵ 380" },
];

const AT_BUNDLES = [
  { label: "1GB", price: "5", display: "1GB — GH₵ 5" },
  { label: "2GB", price: "10", display: "2GB — GH₵ 10" },
  { label: "3GB", price: "15", display: "3GB — GH₵ 15" },
  { label: "4GB", price: "19", display: "4GB — GH₵ 19" },
  { label: "5GB", price: "22", display: "5GB — GH₵ 22" },
  { label: "6GB", price: "26", display: "6GB — GH₵ 26" },
  { label: "7GB", price: "29", display: "7GB — GH₵ 29" },
  { label: "8GB", price: "33", display: "8GB — GH₵ 33" },
  { label: "9GB", price: "38", display: "9GB — GH₵ 38" },
  { label: "10GB", price: "41", display: "10GB — GH₵ 41" },
  { label: "11GB", price: "45", display: "11GB — GH₵ 45" },
  { label: "12GB", price: "49", display: "12GB — GH₵ 49" },
  { label: "13GB", price: "54", display: "13GB — GH₵ 54" },
  { label: "14GB", price: "59", display: "14GB — GH₵ 59" },
  { label: "15GB", price: "65", display: "15GB — GH₵ 65" },
];

const MOMO_PROVIDERS = [
  {
    id: "MTN MoMo",
    label: "MTN MoMo",
    ocid: "momo.mtn_button",
    selectedClass: "border-yellow-400 bg-yellow-50 text-yellow-800",
    defaultClass:
      "border-gray-200 bg-gray-50 text-gray-700 hover:border-yellow-300",
    dot: "bg-yellow-400",
  },
  {
    id: "Telecel Cash",
    label: "Telecel Cash",
    ocid: "momo.telecel_button",
    selectedClass: "border-red-400 bg-red-50 text-red-800",
    defaultClass:
      "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300",
    dot: "bg-red-500",
  },
  {
    id: "AT Money",
    label: "AT Money",
    ocid: "momo.at_button",
    selectedClass: "border-blue-400 bg-blue-50 text-blue-800",
    defaultClass:
      "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300",
    dot: "bg-blue-500",
  },
];

type PaymentMethod = "momo" | "card";
type OrderStatus = "pending" | "processing" | "completed";

type FormError = {
  network?: string;
  bundle?: string;
  phone?: string;
  momoProvider?: string;
  momoNumber?: string;
};

type SuccessData = {
  network: string;
  bundle: string;
  price: string;
  phone: string;
  paymentMethod: PaymentMethod;
  momoProvider?: string;
  momoNumber?: string;
};

const STATUS_STEPS: { key: OrderStatus; label: string; description: string }[] =
  [
    { key: "pending", label: "Pending", description: "Order received" },
    {
      key: "processing",
      label: "Processing",
      description: "Bundle activating",
    },
    { key: "completed", label: "Completed", description: "Bundle delivered" },
  ];

function StatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between relative">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-green-500 z-0 transition-all duration-700 ease-in-out"
          style={{
            width:
              currentIndex === 0 ? "0%" : currentIndex === 1 ? "50%" : "100%",
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div
              key={step.key}
              data-ocid={`order.status_${step.key}`}
              className="flex flex-col items-center z-10 flex-1"
            >
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.12, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat:
                    isActive && status !== "completed"
                      ? Number.POSITIVE_INFINITY
                      : 0,
                  repeatDelay: 1.5,
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? status === "pending"
                        ? "bg-yellow-400 border-yellow-400 text-white"
                        : status === "processing"
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  step.key === "pending" ? (
                    <Clock className="w-5 h-5" />
                  ) : step.key === "processing" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </motion.div>
              <p
                className={cn(
                  "text-xs font-bold mt-2 transition-colors duration-500",
                  isDone
                    ? "text-green-600"
                    : isActive
                      ? status === "pending"
                        ? "text-yellow-600"
                        : status === "processing"
                          ? "text-blue-600"
                          : "text-green-600"
                      : "text-gray-400",
                )}
              >
                {step.label}
              </p>
              <p
                className={cn(
                  "text-xs mt-0.5 transition-colors duration-500",
                  isUpcoming ? "text-gray-300" : "text-gray-500",
                )}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataApp() {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedBundle, setSelectedBundle] = useState("");
  const [phone, setPhone] = useState("");
  const [momoProvider, setMomoProvider] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [errors, setErrors] = useState<FormError>({});
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");

  const placeOrder = usePlaceOrder();
  const createStripeCheckout = useCreateStripeCheckout();

  // Auto-advance order status on success screen
  useEffect(() => {
    if (!successData) return;
    setOrderStatus("pending");
    const t1 = setTimeout(() => setOrderStatus("processing"), 2000);
    const t2 = setTimeout(() => setOrderStatus("completed"), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [successData]);

  // Handle URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentParam = params.get("payment");
    if (paymentParam === "success") {
      setSuccessData({
        network: "",
        bundle: "",
        price: "",
        phone: "",
        paymentMethod: "card",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (paymentParam === "cancelled") {
      toast.error("Payment was cancelled. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const BUNDLES =
    selectedNetwork === "MTN"
      ? MTN_BUNDLES
      : selectedNetwork === "Telecel"
        ? TELECEL_BUNDLES
        : AT_BUNDLES;
  const selectedBundleData = BUNDLES.find((b) => b.label === selectedBundle);

  const handleNetworkChange = (id: string) => {
    setSelectedNetwork(id);
    setSelectedBundle("");
    setErrors((e) => ({ ...e, network: undefined }));
  };

  const validate = () => {
    const e: FormError = {};
    if (!selectedNetwork) e.network = "Please select a network.";
    if (!selectedBundle) e.bundle = "Please choose a bundle.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    else if (phone.trim().length < 10)
      e.phone = "Enter a valid phone number (min 10 digits).";
    if (paymentMethod === "momo") {
      if (!momoProvider) e.momoProvider = "Please select a MoMo provider.";
      if (!momoNumber.trim()) e.momoNumber = "MoMo wallet number is required.";
      else if (momoNumber.trim().replace(/\s/g, "").length < 10)
        e.momoNumber = "Enter a valid MoMo number (min 10 digits).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (paymentMethod === "card") {
      const bundle = selectedBundleData;
      if (!bundle) return;
      try {
        const url = await createStripeCheckout.mutateAsync({
          network: selectedNetwork,
          bundle: bundle.display,
          price: bundle.price,
          phoneNumber: phone.trim(),
        });
        window.location.href = url;
      } catch (_) {}
      return;
    }

    setShowPayDialog(true);
  };

  const handleConfirmPay = async () => {
    const bundle = selectedBundleData;
    if (!bundle) return;

    const providerMap: Record<string, string> = {
      "MTN MoMo": "mtn",
      "Telecel Cash": "vod",
      "AT Money": "tgo",
    };
    const paystackProvider = providerMap[momoProvider] || "mtn";
    const amountPesewas = Math.round(Number.parseFloat(bundle.price) * 100);
    const email = `customer_${momoNumber.replace(/\s/g, "")}@ernestodata.shop`;

    const paystackPop = (window as any).PaystackPop;
    if (!paystackPop) {
      toast.error("Payment system unavailable. Please try again.");
      return;
    }

    setShowPayDialog(false);

    const handler = paystackPop.setup({
      key: "pk_test_0d6acc315ece5a1e218170f9015762cb256cdf1a",
      email,
      amount: amountPesewas,
      currency: "GHS",
      channels: ["mobile_money"],
      mobile_money: {
        phone: momoNumber.trim().replace(/\s/g, ""),
        provider: paystackProvider,
      },
      metadata: {
        network: selectedNetwork,
        bundle: bundle.display,
        recipient: phone.trim(),
      },
      onSuccess: async (_response: any) => {
        try {
          await placeOrder.mutateAsync({
            network: selectedNetwork,
            bundle: bundle.display,
            price: bundle.price,
            phoneNumber: phone.trim(),
          });
          setSuccessData({
            network: selectedNetwork,
            bundle: bundle.display,
            price: bundle.price,
            phone: phone.trim(),
            paymentMethod: "momo",
            momoProvider,
            momoNumber: momoNumber.trim(),
          });
        } catch {
          toast.error(
            "Order could not be recorded, but payment was received. Please contact support.",
          );
        }
      },
      onClose: () => {
        toast.error("Payment was not completed. Please try again.");
      },
    });

    handler.openIframe();
  };

  const handleReset = () => {
    setSelectedNetwork("");
    setSelectedBundle("");
    setPhone("");
    setMomoProvider("");
    setMomoNumber("");
    setErrors({});
    setSuccessData(null);
    setOrderStatus("pending");
    setPaymentMethod("momo");
    placeOrder.reset();
    createStripeCheckout.reset();
  };

  const isCardSuccess =
    successData?.paymentMethod === "card" && !successData.network;

  const statusTitle =
    orderStatus === "pending"
      ? "Order Received"
      : orderStatus === "processing"
        ? "Processing..."
        : isCardSuccess
          ? "Bundle Delivered!"
          : "Bundle Delivered!";

  const statusSubtitle =
    orderStatus === "pending"
      ? "We've received your order and it's in the queue."
      : orderStatus === "processing"
        ? "Your data bundle is being activated now ⚡"
        : isCardSuccess
          ? "Payment by card completed. Your data bundle is on its way ⚡"
          : "Your data bundle has been delivered successfully 🎉";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Nav */}
      <nav className="bg-yellow-500 p-5 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center text-white max-w-lg">
          <h1 className="text-2xl font-black tracking-tighter italic">
            ERNESTO DATA DELIGHT'S
          </h1>
          <div className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Reliable
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-lg pb-16">
        <AnimatePresence mode="wait">
          {successData ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              data-ocid="order.success_state"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              {/* Status Tracker */}
              <StatusTracker status={orderStatus} />

              {/* Status Header */}
              <div className="text-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={orderStatus}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500",
                          orderStatus === "pending"
                            ? "bg-yellow-100"
                            : orderStatus === "processing"
                              ? "bg-blue-100"
                              : "bg-green-100",
                        )}
                      >
                        {orderStatus === "pending" ? (
                          <Clock className="w-8 h-8 text-yellow-500" />
                        ) : orderStatus === "processing" ? (
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-1">
                      {statusTitle}
                    </h2>
                    <p className="text-gray-500 text-sm">{statusSubtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {!isCardSuccess && (
                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Network</span>
                    <span className="font-bold text-gray-800">
                      {successData.network}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Bundle</span>
                    <span className="font-bold text-gray-800">
                      {successData.bundle}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Recipient</span>
                    <span className="font-bold text-gray-800">
                      {successData.phone}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                    <span className="text-gray-500 font-medium">Total</span>
                    <span className="font-black text-yellow-600 text-base">
                      GH₵ {successData.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                    <span className="text-gray-500 font-medium">Paid via</span>
                    <span className="font-bold text-gray-800">
                      {successData.momoProvider} · {successData.momoNumber}
                    </span>
                  </div>
                </div>
              )}

              {isCardSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 text-left">
                    Your card payment was processed securely via Stripe. You'll
                    receive your data bundle shortly.
                  </p>
                </div>
              )}

              <button
                type="button"
                data-ocid="order.primary_button"
                onClick={handleReset}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black text-lg py-5 rounded-2xl transition duration-200 shadow-lg"
              >
                Place Another Order
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Step 1: Select Network */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-gray-800">
                    Select Network
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {NETWORKS.map((net) => (
                    <button
                      key={net.id}
                      type="button"
                      data-ocid={`network.${net.id.toLowerCase()}.card`}
                      onClick={() => handleNetworkChange(net.id)}
                      className={cn(
                        "rounded-xl p-4 text-center transition-all duration-200 border-2",
                        selectedNetwork === net.id
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-transparent bg-gray-50 hover:-translate-y-0.5 hover:border-yellow-400",
                      )}
                    >
                      <img
                        src={net.logo}
                        className="h-8 mx-auto mb-2 rounded"
                        alt={net.label}
                      />
                      <span
                        className={cn(
                          "text-xs font-bold block",
                          net.labelColor,
                        )}
                      >
                        {net.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.network && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.network}
                  </p>
                )}
              </div>

              {/* Step 2: Choose Bundle */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    2
                  </span>
                  <h2 className="text-lg font-bold text-gray-800">
                    Choose Bundle
                  </h2>
                </div>
                <select
                  data-ocid="bundle.select"
                  value={selectedBundle}
                  onChange={(e) => {
                    setSelectedBundle(e.target.value);
                    setErrors((prev) => ({ ...prev, bundle: undefined }));
                  }}
                  className={cn(
                    "w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium text-gray-800",
                    errors.bundle ? "border-red-400" : "border-gray-200",
                  )}
                >
                  <option value="">-- Select Data Plan --</option>
                  {BUNDLES.map((b) => (
                    <option key={b.label} value={b.label}>
                      {b.display}
                    </option>
                  ))}
                </select>
                {errors.bundle && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bundle}
                  </p>
                )}
              </div>

              {/* Step 3: Delivery Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    3
                  </span>
                  <h2 className="text-lg font-bold text-gray-800">
                    Delivery Details
                  </h2>
                </div>
                <input
                  data-ocid="recipient.input"
                  type="tel"
                  placeholder="Phone Number (e.g. 055...)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  className={cn(
                    "w-full p-4 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-lg",
                    errors.phone ? "border-red-400" : "border-gray-200",
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Step 4: Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    4
                  </span>
                  <h2 className="text-lg font-bold text-gray-800">
                    Payment Method
                  </h2>
                </div>

                {/* Payment method toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5">
                  <button
                    type="button"
                    data-ocid="payment.momo_tab"
                    onClick={() => setPaymentMethod("momo")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                      paymentMethod === "momo"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    <Wallet className="w-4 h-4" />
                    MoMo
                  </button>
                  <button
                    type="button"
                    data-ocid="payment.card_tab"
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                      paymentMethod === "card"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    <CreditCard className="w-4 h-4" />
                    Card
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === "momo" ? (
                    <motion.div
                      key="momo"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Provider selection */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {MOMO_PROVIDERS.map((provider) => (
                          <button
                            key={provider.id}
                            type="button"
                            data-ocid={provider.ocid}
                            onClick={() => {
                              setMomoProvider(provider.id);
                              setErrors((prev) => ({
                                ...prev,
                                momoProvider: undefined,
                              }));
                            }}
                            className={cn(
                              "rounded-xl py-3 px-2 text-center border-2 transition-all duration-200 text-xs font-bold flex flex-col items-center gap-1.5",
                              momoProvider === provider.id
                                ? provider.selectedClass
                                : provider.defaultClass,
                            )}
                          >
                            <span
                              className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                provider.dot,
                              )}
                            />
                            {provider.label}
                          </button>
                        ))}
                      </div>
                      {errors.momoProvider && (
                        <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.momoProvider}
                        </p>
                      )}

                      {/* MoMo Number */}
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          data-ocid="momo.number_input"
                          type="tel"
                          placeholder="Enter MoMo number (e.g. 024...)"
                          value={momoNumber}
                          onChange={(e) => {
                            setMomoNumber(e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              momoNumber: undefined,
                            }));
                          }}
                          className={cn(
                            "w-full pl-10 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-base",
                            errors.momoNumber
                              ? "border-red-400"
                              : "border-gray-200",
                          )}
                        />
                      </div>
                      {errors.momoNumber && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.momoNumber}
                        </p>
                      )}

                      {placeOrder.isError && (
                        <div
                          data-ocid="order.error_state"
                          className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mt-4"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Something went wrong. Please try again.</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Stripe card info box */}
                      <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-5 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm mb-1">
                            Pay by Debit or Credit Card
                          </p>
                          <p className="text-gray-500 text-xs leading-relaxed">
                            You'll be redirected to a secure Stripe checkout
                            page to complete your payment by card.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 border border-blue-100">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-semibold text-blue-600">
                            Secure checkout via Stripe
                          </span>
                        </div>
                      </div>

                      {createStripeCheckout.isError && (
                        <div
                          data-ocid="stripe.error_state"
                          className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mt-4"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>
                            Failed to initiate checkout. Please try again.
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  data-ocid={
                    paymentMethod === "card"
                      ? "stripe.submit_button"
                      : "order.submit_button"
                  }
                  onClick={handleSubmit}
                  disabled={
                    placeOrder.isPending || createStripeCheckout.isPending
                  }
                  className="w-full mt-5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-70 text-white font-black text-lg py-5 rounded-2xl transition duration-200 shadow-lg flex justify-between px-8 items-center"
                >
                  {placeOrder.isPending || createStripeCheckout.isPending ? (
                    <span
                      data-ocid={
                        createStripeCheckout.isPending
                          ? "stripe.loading_state"
                          : "order.loading_state"
                      }
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {createStripeCheckout.isPending
                        ? "Redirecting to Stripe..."
                        : "Processing..."}
                    </span>
                  ) : (
                    <>
                      <span>PROCEED</span>
                      <span>
                        {selectedBundleData
                          ? `GH₵ ${selectedBundleData.price}`
                          : "GH₵ 0.00"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer note */}
              <div className="text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Transaction by Ernesto
                </p>
                <p className="text-yellow-600 font-bold mt-2 text-xs uppercase tracking-tighter">
                  Fastest Data Delivery in Ghana 🇬🇭
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MoMo Payment Confirmation Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent
          data-ocid="payment.dialog"
          className="max-w-sm rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-gray-800">
              Confirm Payment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Network</span>
                <span className="font-bold text-gray-800">
                  {selectedNetwork}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bundle</span>
                <span className="font-bold text-gray-800">
                  {selectedBundleData?.display}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Recipient</span>
                <span className="font-bold text-gray-800">{phone}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                <span className="text-gray-500">Total</span>
                <span className="font-black text-yellow-600">
                  GH₵ {selectedBundleData?.price}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              A payment prompt will be sent to{" "}
              <span className="font-bold text-gray-900">{momoNumber}</span>.
              Approve it on your phone to complete the order.
            </p>
          </div>

          <DialogFooter className="gap-2 flex-row">
            <Button
              data-ocid="payment.cancel_button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowPayDialog(false)}
              disabled={placeOrder.isPending}
            >
              Cancel
            </Button>
            <Button
              data-ocid="payment.confirm_button"
              onClick={handleConfirmPay}
              disabled={placeOrder.isPending}
              className="flex-1 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
            >
              {placeOrder.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Paying...
                </span>
              ) : (
                "Confirm & Pay"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataApp />
    </QueryClientProvider>
  );
}
