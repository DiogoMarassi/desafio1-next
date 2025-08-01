interface CardExpansivoProps {
  id: number;
  name: string;
}

export default function CardExpansivo({
  id,
  name,
}: CardExpansivoProps) {
  return (
    <div className="bg-white border rounded-lg shadow-md p-2 text-gray-600 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg">{name}</h3>

    </div>
  );
}
