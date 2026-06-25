import Card from "./Card";

type StatCardProps = {
  title: string;
  value: string | number;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card>
      <h2 className="text-lg text-zinc-400">
        {title}
      </h2>

      <p className="mt-3 text-4xl font-bold">
        {value}
      </p>
    </Card>
  );
}