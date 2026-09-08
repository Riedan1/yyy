import React, { useState, useMemo } from "react";
import { MerchantStore, TeamMember } from "../types";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit, 
  Mail, 
  Check, 
  Eye, 
  EyeOff, 
  Sliders, 
  Clock, 
  Truck, 
  TrendingUp, 
  Tag, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Search,
  Lock,
  Unlock,
  Crown,
  Building,
  AlertTriangle,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { SkeuomorphicSwitch } from "./SkeuomorphicSwitch";

interface MerchantTeamManagementProps {
  darkMode: boolean;
  myStore: MerchantStore;
  setStores: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  activeMemberId: string | null; // null means Owner
  setActiveMemberId: (id: string | null) => void;
}

// Simulated registered workers on the platform that managers can search and invite
const SIMULATED_PLATFORM_WORKERS = [
  { id: "PW-1", name: "Sofiane Meziane", email: "sofiane.m@work.dz", role: "preparator" as const, bio: "Expert in Yalidine Express packaging and courier labeling. 2+ years experience in Algiers." },
  { id: "PW-2", name: "Fatiha Belkaid", email: "fatiha.b@work.dz", role: "manager" as const, bio: "Customer relations coordinator. Experienced in inventory control and discount coupon setups." },
  { id: "PW-3", name: "Yacine Rahmani", email: "yacine.r@work.dz", role: "preparator" as const, bio: "Quick order dispatcher. Familiar with major domestic courier services and central packing hubs." },
  { id: "PW-4", name: "Kamel Benali", email: "kamel.b@work.dz", role: "viewer" as const, bio: "Data analyst focused on buyer demographics and Algerian seasonal market trends." },
  { id: "PW-5", name: "Amel Mansouri", email: "amel.m@work.dz", role: "manager" as const, bio: "Certified retail supervisor. Fluent in Arabic, French, and English for tourism sales." },
  { id: "PW-6", name: "Chafik Boussouf", email: "chafik.b@work.dz", role: "preparator" as const, bio: "Reliable warehouse assistant specializing in fragile crafts, copperware, and pottery." },
  { id: "PW-7", name: "Rania Haddad", email: "rania.h@work.dz", role: "admin" as const, bio: "Senior store operator. Handles full layout designs, payment configurations, and catalogs." },
  { id: "PW-8", name: "Meriem Meziani", email: "meriem.m@work.dz", role: "manager" as const, bio: "Reviews manager. Expert in follower newsletters, community feedback, and checkout codes." }
];

const ScreenshotLogo = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      {/* Head circle */}
      <circle cx="40" cy="28" r="18" />
      
      {/* Torso path */}
      <path 
        d="M10 85 C10 60, 25 55, 48 55" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      
      {/* Arm path */}
      <path 
        d="M54 85 L88 53" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default function MerchantTeamManagement({ 
  darkMode, 
  myStore, 
  setStores,
  activeMemberId,
  setActiveMemberId
}: MerchantTeamManagementProps) {
  
  const [activeTab, setActiveTab] = useState<"staff" | "subscription">("staff");
  
  // State for adding/editing team member
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "preparator" | "viewer">("preparator");
  
  // Custom permissions (synced with preset role but customizable)
  const [confirmOrders, setConfirmOrders] = useState(false);
  const [prepareShipments, setPrepareShipments] = useState(true);
  const [deliveryOperations, setDeliveryOperations] = useState(false);
  const [manageProducts, setManageProducts] = useState(false);
  const [manageDiscounts, setManageDiscounts] = useState(false);
  const [adPixels, setAdPixels] = useState(false);
  const [manageAnalytics, setManageAnalytics] = useState(false);
  const [respondReviews, setRespondReviews] = useState(false);
  const [manageFollowers, setManageFollowers] = useState(false);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [tierWarning, setTierWarning] = useState<string | null>(null);

  // Search filter for active team members
  const [searchQuery, setSearchQuery] = useState("");
  
  // Search filter for available platform workers to hire
  const [workerSearchQuery, setWorkerSearchQuery] = useState("");

  // Get active subscription tier (defaults to Premium if not specified)
  const subscriptionTier = myStore.subscriptionTier || "Premium";

  // Tier configuration mapping
  const tierConfig = useMemo(() => {
    return {
      Basic: { max: 1, label: "Basic (Free)", cost: "0 DZD / month", assistants: "1 assistant allowed", permissions: "View products only" },
      Pro: { max: 4, label: "Pro", cost: "3,500 DZD / month", assistants: "Up to 4 assistants", permissions: "View products only" },
      "Pro Plus": { max: 8, label: "Pro Plus", cost: "7,500 DZD / month", assistants: "Up to 8 assistants", permissions: "View/edit products & ad campaigns" },
      Premium: { max: 20, label: "Premium Verified", cost: "15,000 DZD / month", assistants: "Up to 20 assistants", permissions: "Full unrestricted team permissions" }
    };
  }, []);

  const { max: maxAssistants, label: tierLabel } = useMemo(() => {
    return tierConfig[subscriptionTier] || { max: 20, label: "Premium" };
  }, [subscriptionTier, tierConfig]);

  // Default team members if none exist yet
  const teamMembers = useMemo(() => {
    return myStore.teamMembers || [
      {
        id: "TM-1",
        name: "Yassine Benali",
        email: "yassine.b@store.dz",
        role: "preparator",
        permissions: {
          confirmOrders: false,
          prepareShipments: true,
          deliveryOperations: false,
          manageProducts: false,
          manageDiscounts: false,
          adPixels: false,
          manageAnalytics: false,
          respondReviews: false,
          manageFollowers: false
        },
        status: "active",
        joinedDate: "2026-06-15"
      },
      {
        id: "TM-2",
        name: "Amira Mansouri",
        email: "amira.m@store.dz",
        role: "manager",
        permissions: {
          confirmOrders: true,
          prepareShipments: true,
          deliveryOperations: true,
          manageProducts: true,
          manageDiscounts: false,
          adPixels: true,
          manageAnalytics: false,
          respondReviews: false,
          manageFollowers: false
        },
        status: "invited",
        joinedDate: "2026-06-28"
      }
    ] as TeamMember[];
  }, [myStore.teamMembers]);

  // Helper to determine if a permission is allowed to be customized/enabled on the current plan
  const isPermissionAllowedOnPlan = (permKey: string) => {
    return true; // All permissions are unlocked and fully controllable at any plan tier
  };

  // If store teamMembers is empty, initialize it with defaults
  React.useEffect(() => {
    if (!myStore.teamMembers) {
      setStores((prevStores) => {
        return prevStores.map((store) => {
          if (store.id === myStore.id) {
            return {
              ...store,
              teamMembers: [
                {
                  id: "TM-1",
                  name: "Yassine Benali",
                  email: "yassine.b@store.dz",
                  role: "preparator",
                  permissions: {
                    confirmOrders: false,
                    prepareShipments: true,
                    deliveryOperations: false,
                    manageProducts: false,
                    manageDiscounts: false,
                    adPixels: false,
                    manageAnalytics: false,
                    respondReviews: false,
                    manageFollowers: false
                  },
                  status: "active",
                  joinedDate: "2026-06-15"
                },
                {
                  id: "TM-2",
                  name: "Amira Mansouri",
                  email: "amira.m@store.dz",
                  role: "manager",
                  permissions: {
                    confirmOrders: true,
                    prepareShipments: true,
                    deliveryOperations: true,
                    manageProducts: true,
                    manageDiscounts: false,
                    adPixels: true,
                    manageAnalytics: false,
                    respondReviews: false,
                    manageFollowers: false
                  },
                  status: "invited",
                  joinedDate: "2026-06-28"
                }
              ]
            };
          }
          return store;
        });
      });
    }
  }, [myStore.teamMembers, myStore.id, setStores]);

  // Adjust default permissions when changing role in dropdown (if allowed by tier)
  React.useEffect(() => {
    if (editingMemberId) return; // don't override when editing
    
    // Set baseline defaults depending on role
    let baseline = {
      confirmOrders: false,
      prepareShipments: false,
      deliveryOperations: false,
      manageProducts: false,
      manageDiscounts: false,
      adPixels: false,
      manageAnalytics: false,
      respondReviews: false,
      manageFollowers: false
    };

    if (role === "admin") {
      baseline = {
        confirmOrders: true,
        prepareShipments: true,
        deliveryOperations: true,
        manageProducts: true,
        manageDiscounts: true,
        adPixels: true,
        manageAnalytics: true,
        respondReviews: true,
        manageFollowers: true
      };
    } else if (role === "manager") {
      baseline = {
        confirmOrders: true,
        prepareShipments: true,
        deliveryOperations: true,
        manageProducts: true,
        manageDiscounts: false,
        adPixels: true,
        manageAnalytics: false,
        respondReviews: true,
        manageFollowers: true
      };
    } else if (role === "preparator") {
      baseline = {
        confirmOrders: false,
        prepareShipments: true,
        deliveryOperations: true,
        manageProducts: false,
        manageDiscounts: false,
        adPixels: false,
        manageAnalytics: false,
        respondReviews: false,
        manageFollowers: false
      };
    } else if (role === "viewer") {
      baseline = {
        confirmOrders: false,
        prepareShipments: false,
        deliveryOperations: false,
        manageProducts: false,
        manageDiscounts: false,
        adPixels: false,
        manageAnalytics: false,
        respondReviews: false,
        manageFollowers: false
      };
    }

    // Now, filter baseline through current subscription tier restrictions
    setConfirmOrders(isPermissionAllowedOnPlan("confirmOrders") ? baseline.confirmOrders : false);
    setPrepareShipments(isPermissionAllowedOnPlan("prepareShipments") ? baseline.prepareShipments : false);
    setDeliveryOperations(isPermissionAllowedOnPlan("deliveryOperations") ? baseline.deliveryOperations : false);
    setManageProducts(isPermissionAllowedOnPlan("manageProducts") ? baseline.manageProducts : false);
    setManageDiscounts(isPermissionAllowedOnPlan("manageDiscounts") ? baseline.manageDiscounts : false);
    setAdPixels(isPermissionAllowedOnPlan("adPixels") ? baseline.adPixels : false);
    setManageAnalytics(isPermissionAllowedOnPlan("manageAnalytics") ? baseline.manageAnalytics : false);
    setRespondReviews(isPermissionAllowedOnPlan("respondReviews") ? baseline.respondReviews : false);
    setManageFollowers(isPermissionAllowedOnPlan("manageFollowers") ? baseline.manageFollowers : false);

  }, [role, editingMemberId, subscriptionTier]);

  const handleUpdateSubscriptionTier = (tier: "Basic" | "Pro" | "Pro Plus" | "Premium") => {
    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          return {
            ...store,
            subscriptionTier: tier
          };
        }
        return store;
      });
    });
    setFormError("");
  };

  const handleSelectSimulatedWorker = (worker: typeof SIMULATED_PLATFORM_WORKERS[0]) => {
    setName(worker.name);
    setEmail(worker.email);
    setRole(worker.role);
    setFormError("");
  };

  // Handle invite / save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!name.trim()) {
      setFormError("Please provide a worker name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please provide a valid email address.");
      return;
    }

    // Check assistant limit only when adding a NEW assistant (not when editing)
    if (!editingMemberId) {
      if (teamMembers.length >= maxAssistants) {
        setFormError(`Assistant Limit Reached! Your active [${tierLabel}] plan permits a maximum of ${maxAssistants} assistants. Please upgrade your subscription tier.`);
        return;
      }
    }

    // Sanitize permissions against plan limits before saving
    const finalPermissions = {
      confirmOrders: isPermissionAllowedOnPlan("confirmOrders") ? confirmOrders : false,
      prepareShipments: isPermissionAllowedOnPlan("prepareShipments") ? prepareShipments : false,
      deliveryOperations: isPermissionAllowedOnPlan("deliveryOperations") ? deliveryOperations : false,
      manageProducts: isPermissionAllowedOnPlan("manageProducts") ? manageProducts : false,
      manageDiscounts: isPermissionAllowedOnPlan("manageDiscounts") ? manageDiscounts : false,
      adPixels: isPermissionAllowedOnPlan("adPixels") ? adPixels : false,
      manageAnalytics: isPermissionAllowedOnPlan("manageAnalytics") ? manageAnalytics : false,
      respondReviews: isPermissionAllowedOnPlan("respondReviews") ? respondReviews : false,
      manageFollowers: isPermissionAllowedOnPlan("manageFollowers") ? manageFollowers : false,
    };

    if (editingMemberId) {
      // Edit existing member
      setStores((prevStores) => {
        return prevStores.map((store) => {
          if (store.id === myStore.id) {
            const currentMembers = store.teamMembers || [];
            return {
              ...store,
              teamMembers: currentMembers.map((m) => {
                if (m.id === editingMemberId) {
                  return {
                    ...m,
                    name,
                    email,
                    role,
                    permissions: finalPermissions
                  };
                }
                return m;
              })
            };
          }
          return store;
        });
      });
      setEditingMemberId(null);
      setFormSuccess(true);
    } else {
      // Create new team member
      const isEmailDuplicate = teamMembers.some((m) => m.email.toLowerCase() === email.trim().toLowerCase());
      if (isEmailDuplicate) {
        setFormError("A team member with this email already exists.");
        return;
      }

      const newMember: TeamMember = {
        id: `TM-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
        permissions: finalPermissions,
        status: "invited",
        joinedDate: new Date().toISOString().split("T")[0]
      };

      setStores((prevStores) => {
        return prevStores.map((store) => {
          if (store.id === myStore.id) {
            const currentMembers = store.teamMembers || [];
            return {
              ...store,
              teamMembers: [...currentMembers, newMember]
            };
          }
          return store;
        });
      });

      setFormSuccess(true);
    }

    // Reset inputs
    setName("");
    setEmail("");
    setRole("preparator");
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Start edit
  const startEdit = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setConfirmOrders(!!member.permissions.confirmOrders);
    setPrepareShipments(!!member.permissions.prepareShipments);
    setDeliveryOperations(!!member.permissions.deliveryOperations);
    setManageProducts(!!member.permissions.manageProducts);
    setManageDiscounts(!!member.permissions.manageDiscounts);
    setAdPixels(!!member.permissions.adPixels);
    setManageAnalytics(!!member.permissions.manageAnalytics);
    setRespondReviews(!!member.permissions.respondReviews);
    setManageFollowers(!!member.permissions.manageFollowers);
    setFormError("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMemberId(null);
    setName("");
    setEmail("");
    setRole("preparator");
    setConfirmOrders(false);
    setPrepareShipments(true);
    setDeliveryOperations(false);
    setManageProducts(false);
    setManageDiscounts(false);
    setAdPixels(false);
    setManageAnalytics(false);
    setRespondReviews(false);
    setManageFollowers(false);
    setFormError("");
  };

  // Delete team member
  const handleDeleteMember = (memberId: string) => {
    if (activeMemberId === memberId) {
      setActiveMemberId(null); // Reset session to owner if we delete the active session
    }
    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          const currentMembers = store.teamMembers || [];
          return {
            ...store,
            teamMembers: currentMembers.filter((m) => m.id !== memberId)
          };
        }
        return store;
      });
    });
  };

  const toggleMemberPermission = (memberId: string, permKey: keyof NonNullable<TeamMember["permissions"]>) => {
    setTierWarning(null);

    if (!isPermissionAllowedOnPlan(permKey)) {
      setTierWarning(
        `Plan Restriction: Assigning [${permKey}] is not allowed under your active [${subscriptionTier}] plan tier. Please upgrade your subscription.`
      );
      return;
    }

    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          const currentMembers = store.teamMembers || [];
          return {
            ...store,
            teamMembers: currentMembers.map((m) => {
              if (m.id === memberId) {
                const currentPerms = m.permissions || {
                  confirmOrders: false,
                  prepareShipments: false,
                  deliveryOperations: false,
                  manageProducts: false,
                  manageDiscounts: false,
                  adPixels: false,
                  manageAnalytics: false,
                  respondReviews: false,
                  manageFollowers: false
                };
                return {
                  ...m,
                  permissions: {
                    ...currentPerms,
                    [permKey]: !currentPerms[permKey]
                  }
                };
              }
              return m;
            })
          };
        }
        return store;
      });
    });
  };

  // Switch session quickly
  const handleSimulateSession = (memberId: string | null) => {
    setActiveMemberId(memberId);
  };

  // Active member info
  const activeMemberInfo = useMemo(() => {
    if (!activeMemberId) return null;
    return teamMembers.find((m) => m.id === activeMemberId) || null;
  }, [activeMemberId, teamMembers]);

  // Statistics
  const stats = useMemo(() => {
    const total = teamMembers.length;
    const active = teamMembers.filter((m) => m.status === "active").length;
    const invited = teamMembers.filter((m) => m.status === "invited").length;
    const managers = teamMembers.filter((m) => m.role === "manager").length;
    const preparators = teamMembers.filter((m) => m.role === "preparator").length;

    return { total, active, invited, managers, preparators };
  }, [teamMembers]);

  // Filtered lists
  const filteredTeamMembers = useMemo(() => {
    if (!searchQuery.trim()) return teamMembers;
    return teamMembers.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teamMembers, searchQuery]);

  const filteredPlatformWorkers = useMemo(() => {
    if (!workerSearchQuery.trim()) return SIMULATED_PLATFORM_WORKERS;
    return SIMULATED_PLATFORM_WORKERS.filter(w => 
      w.name.toLowerCase().includes(workerSearchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(workerSearchQuery.toLowerCase()) ||
      w.bio.toLowerCase().includes(workerSearchQuery.toLowerCase())
    );
  }, [workerSearchQuery]);

  return (
    <div className="flex flex-col gap-6 fade-in text-left">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-950/45 via-indigo-950/35 to-slate-900/45 backdrop-blur-md text-white p-6 rounded-2xl border border-indigo-500/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_32px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ScreenshotLogo className="w-40 h-40 animate-pulse text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Roles, Permissions & Staff Access
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
              Team & Staff Access Control
            </h2>
            <p className="text-xs text-indigo-200/90 max-w-2xl mt-1.5 leading-relaxed">
              Invite warehouse packers, store coordinators, or regional delivery managers. Customize specific capabilities gated directly by your active subscription plan.
            </p>
          </div>
          
          {/* Sub Tab Switcher */}
          <div className="bg-slate-950/60 p-1 rounded-xl border border-indigo-500/30 flex shrink-0 self-stretch md:self-auto gap-1">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "staff" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Staff Directory
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "subscription" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Subscription Tiers
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Quick Box */}
      <div className={`p-4 rounded-xl border-2 border-dashed flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        darkMode ? "bg-amber-950/20 border-amber-500/30 text-amber-200" : "bg-amber-50/60 border-amber-300 text-amber-900"
      }`}>
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <span>Interactive Session Simulator</span>
              <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-sans uppercase">Demo Hub</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Select which assistant is currently acting to test restricted views and operations! Tiers lock custom permissions in real-time.
            </p>
            <div className="mt-2.5 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400">Operating Session:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                  !activeMemberInfo 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}>
                  {!activeMemberInfo ? "Store Owner (All Permissions)" : `${activeMemberInfo.name} (${activeMemberInfo.role.toUpperCase()})`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400">Plan Tier:</span>
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg text-xs font-bold">
                  {subscriptionTier.toUpperCase()} ({maxAssistants} Assist. Max)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rapid switcher */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => handleSimulateSession(null)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
              !activeMemberId 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-300 dark:hover:bg-slate-750"
            }`}
          >
            Act as Owner
          </button>
          {teamMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSimulateSession(m.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                activeMemberId === m.id 
                  ? "bg-indigo-600 text-white border-indigo-600" 
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-300 dark:hover:bg-slate-750"
              }`}
            >
              Act as {m.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "subscription" ? (
        /* SUBSCRIPTION PLAN TAB */
        <div className="flex flex-col gap-6 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["Basic", "Pro", "Pro Plus", "Premium"] as const).map((tierKey) => {
              const tier = tierConfig[tierKey];
              const isCurrent = subscriptionTier === tierKey;
              return (
                <div 
                  key={tierKey} 
                  onClick={() => handleUpdateSubscriptionTier(tierKey)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isCurrent 
                      ? "border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20" 
                      : darkMode ? "bg-slate-800/40 border-slate-700/60 hover:border-slate-650" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      Active Plan
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Level</span>
                    <h3 className="text-lg font-black mt-1 text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      {tierKey === "Premium" && <Crown className="w-4 h-4 text-yellow-500" />}
                      {tier.label}
                    </h3>
                    <div className="mt-2 text-2xl font-black font-mono text-indigo-500">
                      {tier.cost}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">
                      {tier.assistants}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-dashed border-slate-200/40 pt-3">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Permissions Allowed</span>
                    <span className={`text-[11px] font-bold ${isCurrent ? "text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {tier.permissions}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateSubscriptionTier(tierKey);
                    }}
                    className={`w-full mt-5 py-2 rounded-xl text-xs font-black transition-all ${
                      isCurrent 
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm" 
                        : darkMode ? "bg-slate-750 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-250"
                    }`}
                  >
                    {isCurrent ? "Active Plan Selected" : `Switch to ${tierKey}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Detailed comparison specs */}
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"}`}>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-indigo-500" />
              Subscription Authorization Grid & Limits
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/40 text-slate-400">
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Plan Name</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px] text-center">Max Staff</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Product Views</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Product Editing</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Ad Pixels & Campaigns</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Coupons, reviews, analytics & follower control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/20 text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="py-3 font-extrabold text-slate-800 dark:text-slate-100">Basic (Free)</td>
                    <td className="py-3 font-mono text-center font-bold">1</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-extrabold text-slate-800 dark:text-slate-100">Pro</td>
                    <td className="py-3 font-mono text-center font-bold">4</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-extrabold text-slate-800 dark:text-slate-100">Pro Plus</td>
                    <td className="py-3 font-mono text-center font-bold">8</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-slate-400">— Locked</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-extrabold text-slate-800 dark:text-slate-100 text-yellow-500 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      Premium
                    </td>
                    <td className="py-3 font-mono text-center font-bold">20</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Included (Full Privileges)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* STAFF DIRECTORY TAB */
        <div className="flex flex-col gap-6 fade-in">
          
          {/* KPI Summary Rows */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
            } shadow-xs`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono">{stats.total + 1}</div>
                <p className="text-[9.5px] text-slate-500 mt-1">Owner + {stats.total} Assistants</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
            } shadow-xs`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Plan Limit</span>
                <Crown className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono">{stats.total} / {maxAssistants}</div>
                <p className="text-[9.5px] text-slate-500 mt-1">{maxAssistants - stats.total} vacancies remaining</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
            } shadow-xs`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invited Pending</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono">{stats.invited}</div>
                <p className="text-[9.5px] text-slate-500 mt-1">Awaiting workspace accept</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
            } shadow-xs`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Gating</span>
                <Lock className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2">
                <div className="text-xs font-black uppercase text-indigo-400">
                  {subscriptionTier === "Premium" ? "Unrestricted Control" : "Plan-Level Gated"}
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1">Based on {subscriptionTier} tier rules</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Invite Form & Searchable candidate worker list (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* SECTION: Employee search on platform pool */}
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-slate-200/40">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                      Search Platform Workers
                    </h3>
                  </div>
                  <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    Suggested Candidates
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-3.5 leading-relaxed">
                  Search registered employees in the platform worker index. Click on a worker profile to immediately populate the invite/hire details below!
                </p>

                {/* Search Bar for Platform worker pool */}
                <div className="relative mb-4 text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search candidate workers by name, bio, skills..."
                    value={workerSearchQuery}
                    onChange={(e) => setWorkerSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                  {workerSearchQuery && (
                    <button 
                      onClick={() => setWorkerSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Candidate Worker Scroll Box */}
                <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2.5 pr-1 text-xs">
                  {filteredPlatformWorkers.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                      No candidate workers match "{workerSearchQuery}"
                    </div>
                  ) : (
                    filteredPlatformWorkers.map((worker) => (
                      <div 
                        key={worker.id}
                        onClick={() => handleSelectSimulatedWorker(worker)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-start gap-3 ${
                          darkMode ? "bg-slate-900/40 border-slate-800 hover:bg-slate-850" : "bg-slate-50 border-slate-150 hover:bg-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-slate-800 dark:text-slate-200 text-[11.5px]">{worker.name}</span>
                            <span className="px-1.5 py-0.5 text-[8px] uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                              {worker.role}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-indigo-400 block font-mono">{worker.email}</span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {worker.bio}
                          </p>
                        </div>
                        <button className="shrink-0 text-indigo-400 hover:text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/15 p-1 rounded-lg transition-all border border-indigo-500/20 text-[10px] font-extrabold flex items-center gap-0.5 uppercase">
                          <Plus className="w-3 h-3" />
                          Hire
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* FORM: Invite / Edit Team Member */}
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-dashed border-slate-200/40">
                  <UserPlus className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {editingMemberId ? "Edit Assistant Profile" : "Invite & Hire Assistant"}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10.5px]">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-[10.5px]">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Staff member profile updated and synchronized!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Assistant Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Sidali Belkacem"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., s.belkacem@yalidine.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Access Role Preset
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="preparator">Preparator (Fulfills orders & ships)</option>
                      <option value="manager">Store Manager (Accepts orders, edits products)</option>
                      <option value="admin">Admin Partner (Full control)</option>
                      <option value="viewer">Viewer (Read-only insights)</option>
                    </select>
                  </div>

                  {/* Advanced Custom Permissions - Gated by Subscription Plan */}
                  <div className="border-t border-dashed border-slate-200/40 pt-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Custom Permissions Gating
                      </span>
                      <span className="text-[8.5px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md font-extrabold uppercase">
                        {subscriptionTier} tier
                      </span>
                    </div>

                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[10px] leading-snug flex items-center gap-2 font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        All granular permission controls are fully unlocked on your active plan tier.
                      </div>
                    </div>

                    {/* Permission Item: Confirm Orders */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Confirm Orders</span>
                          {!isPermissionAllowedOnPlan("confirmOrders") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Validate and accept incoming buyer checkouts</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={confirmOrders && isPermissionAllowedOnPlan("confirmOrders")}
                        onChange={setConfirmOrders}
                        disabled={!isPermissionAllowedOnPlan("confirmOrders")}
                      />
                    </div>

                    {/* Permission Item: Prepare Shipments */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Prepare Shipments</span>
                          {!isPermissionAllowedOnPlan("prepareShipments") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Print invoices, dispatch packages & change shipping status</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={prepareShipments && isPermissionAllowedOnPlan("prepareShipments")}
                        onChange={setPrepareShipments}
                        disabled={!isPermissionAllowedOnPlan("prepareShipments")}
                      />
                    </div>

                    {/* Permission Item: Delivery Operations Across Countries */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Cross-Country Logistics</span>
                          {!isPermissionAllowedOnPlan("deliveryOperations") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Control regional shipping rates, Yalidine express api linkages</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={deliveryOperations && isPermissionAllowedOnPlan("deliveryOperations")}
                        onChange={setDeliveryOperations}
                        disabled={!isPermissionAllowedOnPlan("deliveryOperations")}
                      />
                    </div>

                    {/* Permission Item: Modify Products */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Modify Products</span>
                          {!isPermissionAllowedOnPlan("manageProducts") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Add new items, modify descriptions, adjust inventories</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={manageProducts && isPermissionAllowedOnPlan("manageProducts")}
                        onChange={setManageProducts}
                        disabled={!isPermissionAllowedOnPlan("manageProducts")}
                      />
                    </div>

                    {/* Permission Item: Link Ad Pixels & Campaigns */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Link Pixels & Campaigns</span>
                          {!isPermissionAllowedOnPlan("adPixels") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Configure Facebook/TikTok/Google marketing trackers</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={adPixels && isPermissionAllowedOnPlan("adPixels")}
                        onChange={setAdPixels}
                        disabled={!isPermissionAllowedOnPlan("adPixels")}
                      />
                    </div>

                    {/* Permission Item: Manage Coupons & Discounts */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Manage Coupons</span>
                          {!isPermissionAllowedOnPlan("manageDiscounts") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Generate coupon promo codes & bundle configurations</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={manageDiscounts && isPermissionAllowedOnPlan("manageDiscounts")}
                        onChange={setManageDiscounts}
                        disabled={!isPermissionAllowedOnPlan("manageDiscounts")}
                      />
                    </div>

                    {/* Permission Item: Manage Analytics */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Manage Analytics</span>
                          {!isPermissionAllowedOnPlan("manageAnalytics") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Sync and export invoice sheets to Google Drive</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={manageAnalytics && isPermissionAllowedOnPlan("manageAnalytics")}
                        onChange={setManageAnalytics}
                        disabled={!isPermissionAllowedOnPlan("manageAnalytics")}
                      />
                    </div>

                    {/* Permission Item: Respond to Reviews */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Respond to Reviews</span>
                          {!isPermissionAllowedOnPlan("respondReviews") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Reply to client star reviews & apply bulk templates</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={respondReviews && isPermissionAllowedOnPlan("respondReviews")}
                        onChange={setRespondReviews}
                        disabled={!isPermissionAllowedOnPlan("respondReviews")}
                      />
                    </div>

                    {/* Permission Item: Control Followers */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/20">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <span>Control Followers</span>
                          {!isPermissionAllowedOnPlan("manageFollowers") && <Lock className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Approve, block, or verify buyer community followers</span>
                      </div>
                      <SkeuomorphicSwitch
                        checked={manageFollowers && isPermissionAllowedOnPlan("manageFollowers")}
                        onChange={setManageFollowers}
                        disabled={!isPermissionAllowedOnPlan("manageFollowers")}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl text-center cursor-pointer hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {editingMemberId ? "Update Assistant" : "Hire & Add to Team"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Active Directory (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* SECTION: Active directory list */}
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-dashed border-slate-200/40">
                  <div className="flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        Staff & Member Directory
                      </h3>
                      <p className="text-[10px] text-slate-400">Manage permissions, invite links, or trigger active sessions</p>
                    </div>
                  </div>

                  {/* Active Staff Search Filter */}
                  <div className="relative text-xs w-full sm:w-auto shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Search active staff..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full sm:w-48 pl-8 pr-2.5 py-1 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-700"
                      }`}
                    />
                  </div>
                </div>

                {/* Staff directory scrolling container */}
                <div className="flex flex-col gap-3.5">
                  
                  {/* Always display owner first */}
                  <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                    darkMode ? "bg-slate-900/40 border-slate-850" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-sm uppercase shrink-0 border border-emerald-500/25">
                        OW
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-slate-800 dark:text-slate-200">{myStore.merchantFullName || "Store Owner"}</span>
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Owner
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">{myStore.contact?.email || "owner@store.dz"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap shrink-0">
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-xl border border-emerald-500/10">
                        ★ Super Administrator
                      </span>
                      {!activeMemberId && (
                        <span className="text-[9.5px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full uppercase shrink-0 animate-pulse">
                          Active Simulator
                        </span>
                      )}
                    </div>
                  </div>

                  {tierWarning && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>{tierWarning}</span>
                      </div>
                      <button 
                        onClick={() => setTierWarning(null)}
                        className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Filtered Team Member List */}
                  {filteredTeamMembers.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No team members match search query.
                    </div>
                  ) : (
                    filteredTeamMembers.map((m) => {
                      const isSelectedActive = activeMemberId === m.id;
                      
                      return (
                        <div 
                          key={m.id} 
                          className={`p-4 rounded-xl border flex flex-col gap-4 transition-all ${
                            darkMode ? "bg-slate-900/60 border-slate-850 hover:bg-slate-850" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                          }`}
                        >
                          {/* Top Row: Basic Info & Control Actions */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-sm uppercase shrink-0 border border-indigo-500/25 font-mono">
                                {m.name.slice(0, 2)}
                              </div>
                              <div className="min-w-0 text-xs text-left">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-slate-800 dark:text-slate-200 truncate">{m.name}</span>
                                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                                    m.role === "admin" 
                                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                                      : m.role === "manager" 
                                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                      : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                  }`}>
                                    {m.role}
                                  </span>
                                  <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-md ${
                                    m.status === "active" 
                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" 
                                      : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                                  }`}>
                                    {m.status}
                                  </span>
                                </div>
                                <span className="text-[10.5px] text-slate-400 block mt-0.5 truncate">{m.email}</span>
                              </div>
                            </div>

                            {/* Actions List */}
                            <div className="flex items-center gap-1.5 justify-end w-full sm:w-auto shrink-0">
                              <button
                                onClick={() => handleSimulateSession(isSelectedActive ? null : m.id)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[9.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  isSelectedActive 
                                    ? "bg-emerald-500 text-white border-emerald-500" 
                                    : "border-indigo-500/25 hover:bg-indigo-500/15 text-indigo-400"
                                }`}
                              >
                                {isSelectedActive ? "Active Session" : "Test as Member"}
                              </button>
                              
                              <button
                                onClick={() => startEdit(m)}
                                className="p-1.5 text-indigo-400 hover:text-indigo-500 hover:bg-indigo-500/15 rounded-lg transition-all cursor-pointer border border-indigo-500/20"
                                title="Edit Permissions"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteMember(m.id)}
                                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/15 rounded-lg transition-all cursor-pointer border border-red-500/20"
                                title="Revoke Assistant Access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Divider line */}
                          <div className="border-t border-dashed border-slate-200/20 w-full" />

                          {/* Bottom Section: Granular Task Allocation Toggles */}
                          <div className="text-left">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                Granular Task Allocations & Authorization
                              </span>
                              <span className="text-[8.5px] bg-slate-200/50 dark:bg-slate-850 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                                {Object.values(m.permissions || {}).filter(Boolean).length} / 9 Active
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                { key: "confirmOrders", label: "Confirm Orders", icon: CheckCircle, desc: "Process checkouts" },
                                { key: "prepareShipments", label: "Manage Shipping", icon: Truck, desc: "Pack & Yalidine express" },
                                { key: "deliveryOperations", label: "Cross Logistics", icon: Building, desc: "Rate setups & couriers" },
                                { key: "manageProducts", label: "Manage Products", icon: Tag, desc: "Modify catalog/inventory" },
                                { key: "manageDiscounts", label: "Control Discount Codes", icon: Sliders, desc: "Coupons & bundle promo" },
                                { key: "adPixels", label: "Ad Pixels & Camps", icon: TrendingUp, desc: "Facebook/TikTok track" },
                                { key: "manageAnalytics", label: "Export Analytics", icon: Info, desc: "Google Sheets sync" },
                                { key: "respondReviews", label: "Respond to Reviews", icon: MessageSquare, desc: "Reply to stars" },
                                { key: "manageFollowers", label: "Control Followers", icon: Users, desc: "Approve/block buyers" },
                              ].map((item) => {
                                const hasPerm = !!(m.permissions && m.permissions[item.key as keyof typeof m.permissions]);
                                const allowed = isPermissionAllowedOnPlan(item.key);

                                return (
                                  <button
                                    key={item.key}
                                    onClick={() => toggleMemberPermission(m.id, item.key as any)}
                                    className={`p-2 rounded-lg border text-left transition-all relative overflow-hidden group flex flex-col justify-between h-14 ${
                                      !allowed
                                        ? "opacity-50 bg-slate-100/10 border-slate-200/10 cursor-not-allowed text-slate-400"
                                        : hasPerm
                                        ? "bg-indigo-600/15 border-indigo-500 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-600/20 cursor-pointer"
                                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/40 dark:border-slate-750 dark:text-slate-400 dark:hover:bg-slate-750 cursor-pointer"
                                    }`}
                                    title={!allowed ? "Locked under current plan" : item.desc}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-extrabold text-[10.5px] tracking-tight truncate pr-1">
                                        {item.label}
                                      </span>
                                      <div className="shrink-0">
                                        {!allowed ? (
                                          <Lock className="w-2.5 h-2.5 text-rose-400" />
                                        ) : hasPerm ? (
                                          <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                                        ) : (
                                          <Plus className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-[8.5px] text-slate-400 font-medium truncate w-full block mt-1">
                                      {item.desc}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SECTION: Guidelines box */}
              <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
                darkMode ? "bg-slate-900/40 text-slate-400 border-slate-700/50" : "bg-slate-50 text-slate-500 border-slate-200"
              }`}>
                <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-300">Workspace Authorization Guidelines:</p>
                  <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1 text-[11px] text-slate-400">
                    <li><strong>Assistant Limit</strong>: Enforced according to plan limits (Basic: 1, Pro: 4, Pro Plus: 8, Premium: 20 assistants).</li>
                    <li><strong>Custom Permission Toggles</strong>: Subscriptions restrict what capability can be assigned. Under Basic/Pro, custom toggles are forced to off since assistants can only view products. Pro Plus permits editing products and managing ad campaigns.</li>
                    <li><strong>Interactive Demo Switcher</strong>: Select 'Test as Member' to simulate live operations. Attempting restricted actions triggers an elegant Permission Error Banner.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
