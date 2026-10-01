import { describe, expect, it } from "vitest";
import { parentCheckinEmail } from "../lib/email/parent-checkin";
import { parseLumaRegistration } from "../lib/luma/parser";
describe("parent email",()=>{it("uses configured call values",()=>{const m=parentCheckinEmail({date:"12 October",time:"6 PM",timezone:"Asia/Kolkata",lumaLink:"https://lu.ma/haven",title:"Call"});expect(m.subject).toBe("Call");expect(m.text).toContain("12 October");expect(m.text).toContain("https://lu.ma/haven");});});
describe("Luma adapter",()=>{it("extracts parent safely",()=>expect(parseLumaRegistration({parent:{name:"P",email:"p@example.com"},registration:{id:"r1"}})).toMatchObject({parentEmail:"p@example.com",registrationId:"r1"}));});
