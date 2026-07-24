"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLogin, useNotify } from "react-admin";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        
        {/* Logo Oficial Infodive */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-44 h-12 flex items-center justify-center">
            <Image
              src="/logo-infodive.png"
              alt="Infodive Logo"
              width={180}
              height={50}
              priority
              className="object-contain"
            />
          </div>
          <div className="text-center pt-2">
            <h1 className="text-lg font-semibold text-slate-100 tracking-tight">Painel Administrativo</h1>
            <p className="text-xs text-slate-400 mt-1">Gestão de Conteúdo e Serviços</p>
          </div>
        </div>

        {/* Botão Oficial Microsoft */}
        <div className="pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 text-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Autenticando...</span>
              </div>
            ) : (
              <>
                {/* Logo da Microsoft */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" fill="none">
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

        {/* Rodapé limpo */}
        <div className="pt-2 text-center border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500">
            Acesso exclusivo para contas <span className="text-slate-400 font-medium">@infodive.com.br</span>
          </p>
        </div>

      </div>
    </div>
  );
}
