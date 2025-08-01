interface CardProps {
  id: number;
  name: string;
  editable?: boolean;
  add?: boolean;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export default function Card({
  id,
  name,
  editable = false,
  add = false,
  onEdit,
  onRemove,
}: CardProps) {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 text-gray-800 hover:shadow-lg transition-shadow duration-200">
      <h3 className="font-semibold text-xl">{name}</h3>

      {editable && (
        <div className="mt-3 flex gap-3">
          <button
            className="px-3 py-1 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={() => onEdit && onEdit(id)}
          >
            Editar
          </button>
          <button
            className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
            onClick={() => onRemove && onRemove(id)}
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
