import { useState } from "react";
import { login } from "./api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(username, password);
      onLogin(user);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
      <div className="w-full max-w-md px-6">
        {/* Title */}

        <div className="text-center mb-8">
          <h1 className="text-white mb-2 text-4xl font-semibold">
            Job Application Tracker
          </h1>
          <p className="text-zinc-300">
            Stay organised during your job search
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-700 p-8 shadow-xl">
          <p className="text-center text-zinc-200 mb-6">Please sign in</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-200">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Footer */}
            <div className="text-center">
              <span className="text-sm text-zinc-400 hover:text-white cursor-pointer">
                Forgot password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
