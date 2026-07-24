"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HistoryIcon from "@mui/icons-material/History";

const LogAuditoriaFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Buscar por detalhes ou e-mail" source="q" alwaysOn />
    <SelectInput
      label="Ação"
      source="acao"
      choices={[
        { id: "CRIACAO", name: "Criação" },
        { id: "ATUALIZACAO", name: "Atualização" },
        { id: "EXCLUSAO", name: "Exclusão" },
      ]}
    />
  </Filter>
);

const getAcaoChip = (record: any) => {
  const acao = record?.acao;
  if (acao === "CRIACAO") {
    return (
      <Chip
        label="CRIAÇÃO"
        size="small"
        sx={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          color: "#10b981",
          fontWeight: 600,
          borderRadius: "6px",
        }}
      />
    );
  }
  if (acao === "ATUALIZACAO") {
    return (
      <Chip
        label="ATUALIZAÇÃO"
        size="small"
        sx={{
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          color: "#3b82f6",
          fontWeight: 600,
          borderRadius: "6px",
        }}
      />
    );
  }
  if (acao === "EXCLUSAO") {
    return (
      <Chip
        label="EXCLUSÃO"
        size="small"
        sx={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          fontWeight: 600,
          borderRadius: "6px",
        }}
      />
    );
  }
  return <Chip label={acao || "-"} size="small" />;
};

export const LogAuditoriaList = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, mt: 1 }}>
        <HistoryIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
            Logs de Auditoria
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Histórico completo de alterações realizadas por colaboradores no sistema.
          </Typography>
        </div>
      </Box>

      <List
        filters={<LogAuditoriaFilter />}
        sort={{ field: "criadoEm", order: "DESC" }}
        component="div"
        actions={false}
      >
        <Datagrid bulkActionButtons={false} rowClick={false}>
          <DateField
            source="criadoEm"
            label="Data & Hora"
            showTime
            options={{ dateStyle: "short", timeStyle: "short" }}
          />
          <FunctionField
            label="Usuário Responsável"
            render={(record: any) => (
              <Box sx={{ display: "flex", flexDirection: "col" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {record.usuarioEmail}
                </Typography>
              </Box>
            )}
          />
          <FunctionField label="Ação" render={(record: any) => getAcaoChip(record)} />
          <TextField source="recurso" label="Módulo / Recurso" />
          <TextField source="detalhes" label="Detalhes da Modificação" />
        </Datagrid>
      </List>
    </Box>
  );
};
