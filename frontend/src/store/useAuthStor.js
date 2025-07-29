import { create } from "zustand";
import { axiosInstance } from "../lib/axiosLib";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggedIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("Check Auth Response:", res);
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.error("Error checking authentication:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    console.log("Signup Data:", data);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signup successful!");
    } catch (error) {
      set({ authUser: null });
      toast.error(`Signup failed, ${error?.response?.data?.message}`);
      console.error("Error during signup:", error);
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggedIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("logged in successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggedIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, isLoggedIn: false });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Error during logout:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res?.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

//   persist(
//     (set) => ({
//       authUser: null,
//       isSigninUp: false,
//       isLoggedIn: false,
//       isUpdatingProfile: false,
//       isCheckingAuth: true,

//       checkAuth: async () => {
//         try {
//           const res = await axiosInstance.get("/auth/check");
//           set({ authUser: res.data });
//         } catch (error) {
//           set({ authUser: null });
//         } finally {
//           set({ isCheckingAuth: false });
//         }
//       },

//       signup: async (data) => {
//         set({ isSigninUp: true });
//         try {
//           const res = await axiosInstance.post("/auth/signup", data);
//           set({ authUser: res.data });
//           toast.success("Signup successful!");
//         } catch (error) {
//           set({ authUser: null });
//           toast.error("Signup failed. Please try again.");
//         } finally {
//           set({ isSigninUp: false });
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) =>
//         ({ authUser: state.authUser }),
//     }
//   )
// );
