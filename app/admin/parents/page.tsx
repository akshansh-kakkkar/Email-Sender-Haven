import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ParentsClient from "./parents-client";
export default async function ParentsPage() { const store = await cookies(); if (!store.get("haven_admin_session")) redirect("/admin/login"); return <ParentsClient csrf={store.get("haven_admin_csrf")?.value ?? ""} />; }
