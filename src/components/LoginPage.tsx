"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLogin, useNotify } from "react-admin";
import { signIn, useSession } from "next-auth/react";

export default function CustomLoginPage() {
  const login = useLogin();
  const notify = useNotify();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const attemptMade = useRef(false);

  // Quando o usuário é autenticado com sucesso pelo Microsoft Entra ID via NextAuth
  useEffect(() => {
    if (status === "authenticated" && session && !attemptMade.current) {
      const idToken = (session as any).idToken;
      const email = session.user?.email;

      if (idToken || email) {
        attemptMade.current = true;
        setLoading(true);
        // Valida o token Microsoft real no backend Spring Boot
        login({ username: idToken || email })
          .then(() => {
            window.location.href = "/";
          })
          .catch((error) => {
            const errorMsg = error?.message || "Acesso negado. Apenas e-mails corporativos @infodive.com.br são autorizados.";
            notify(errorMsg, { type: "error" });
            setLoading(false);
          });
      }
    }
  }, [status, session, login, notify]);

  const handleMicrosoftLogin = () => {
    attemptMade.current = false;
    setLoading(true);
    signIn("azure-ad", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-2">
            <span className="text-2xl font-bold tracking-tight text-indigo-400">INFODIVE</span>
            <span className="text-xs ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-semibold border border-indigo-400/30">ADMIN</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Painel de Controle</h1>
          <p className="text-sm text-slate-400">
            Acesso exclusivo para colaboradores <span className="font-semibold text-slate-200">@infodive.com.br</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3.5 px-5 rounded-2xl shadow-lg transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Autenticando via Microsoft...</span>
              </div>
            ) : (
              <>
                {/* Microsoft Logo SVG */}
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <span>Entrar com Microsoft</span>
              </>
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Autenticação corporativa oficial via Microsoft Entra ID</span>
        </div>
      </div>
    </div>
  );
}
