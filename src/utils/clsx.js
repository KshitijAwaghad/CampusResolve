export default function clsx(...args) {
  return args.filter(Boolean).join(" ");
}
