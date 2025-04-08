"use client";

import { useState, useEffect } from "react";
import { useWebsitesContext } from "@/context/websites-context";
import { WebsiteCard } from "@/components/website-card";
import { WebsiteCardSkeleton } from "@/components/website-card-skeleton";
import { AddWebsiteModal } from "@/components/add-website-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Website } from "@/types/website";
import { API_BACKEND_URL } from "@/config/config";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export function UptimeDashboard() {
  const { websites, refreshWebsites } = useWebsitesContext();
  const { getToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);

      // only refresh if user is authenticated
      if (token) {
        await refreshWebsites();
      }
    };

    checkAuthentication();
  }, [getToken]);

  // Filter websites based on search query and status filter
  const filteredWebsites = websites.filter((website) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new URL(website.url).hostname
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const uptime = calculateUptimePercentage(website.ticks);
    const status = getStatusFromUptime(uptime);

    if (statusFilter === "all") return matchesSearch; // If "all" is selected, return all matching search results

    return matchesSearch && status === statusFilter; // Filter by status
  });

  // Sort websites
  const sortedWebsites = [...filteredWebsites].sort((a, b) => {
    switch (sortBy) {
      case "status":
        return getStatusPriority(a) - getStatusPriority(b);
      case "name":
        return new URL(a.url).hostname.localeCompare(new URL(b.url).hostname);
      case "uptime":
        return (
          calculateUptimePercentage(b.ticks) -
          calculateUptimePercentage(a.ticks)
        );
      default:
        return 0;
    }
  });

  // Handle refresh all
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    setError(null); // Reset error state before making the request
    try {
      await refreshWebsites();
    } catch (err) {
      setError("Failed to refresh websites. Please try again later."); // Set error message
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle add website
  const handleAddWebsite = async (values: { name: string; url: string }) => {
    try {
      const token = await getToken();
      await axios.post(`${API_BACKEND_URL}/api/v1/website`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await refreshWebsites();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Failed to add website. Please try again later."); // set error message
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Failed to add website:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">  
            Uptime Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Monitor your Web3 infrastructure with decentralized validators.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Sort websites">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="status">
                  Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="uptime">
                  Uptime
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Filter websites"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <DropdownMenuRadioItem value="all">
                  All Websites
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="online">
                  Online
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="degraded">
                  Degraded
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="offline">
                  Offline
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh All"}
          </Button>

          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Website
          </Button>
        </div>
      </div>

      {/* Website Grid */}
      {isAuthenticated ? (
        sortedWebsites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No websites found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery || statusFilter !== "all"
                ? "No websites match your search criteria. Try different filters."
                : "You haven't added any websites to monitor yet. Add your first website to get started."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Your First Website
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-medium mb-2">
            You are not authenticated
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please log in to view your websites.
          </p>
        </div>
      )}

      {/* Add Website Modal */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddWebsite}
      />
    </div>
  );
}

// Helper functions
function getStatusPriority(website: Website): number {
  const uptime = calculateUptimePercentage(website.ticks);
  if (uptime < 95) return 0; // Offline - highest priority
  if (uptime < 99) return 1; // Degraded
  return 2; // Online - lowest priority
}

function calculateUptimePercentage(ticks: any[]): number {
  if (ticks.length === 0) return 0;

  const upTicks = ticks.filter((tick) => tick.status === "up").length;
  return (upTicks / ticks.length) * 100;
}

function getStatusFromUptime(
  uptime: number
): "online" | "degraded" | "offline" {
  if (uptime >= 99) return "online";
  if (uptime >= 95) return "degraded";
  return "offline";
}
