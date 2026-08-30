import { Armchair, Droplets, Lightbulb, Megaphone, Snowflake, Sparkles, Wrench, Zap } from "lucide-react";
const icons = { chair: Armchair, droplet: Droplets, bulb: Lightbulb, megaphone: Megaphone, snowflake: Snowflake, sparkles: Sparkles, wrench: Wrench, zap: Zap };
export default function Icon({ name, className = "" }) { const Component = icons[name] || Wrench; return <Component className={className} aria-hidden="true" />; }
