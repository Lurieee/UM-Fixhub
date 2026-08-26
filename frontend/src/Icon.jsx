import { Armchair, Droplets, Lightbulb, Megaphone, Snowflake, Wrench } from "lucide-react";
const icons = { chair: Armchair, droplet: Droplets, bulb: Lightbulb, megaphone: Megaphone, snowflake: Snowflake, wrench: Wrench };
export default function Icon({ name, className = "" }) { const Component = icons[name] || Wrench; return <Component className={className} aria-hidden="true" />; }
