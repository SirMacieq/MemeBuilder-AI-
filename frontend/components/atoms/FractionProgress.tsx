const FractionProgress = ({
  current,
  target,
  fractions,
}: {
  current: number;
  target: number;
  fractions: number;
}) => {
  const percentage = (current * 100) / target;
  return (
    <div className="flex w-full mb-[16px]">
      {[...Array(fractions)].map((_, index) => {
        const isFilled = percentage >= (index + 1) * (100 / fractions);
        return (
          <div
            key={index}
            className={`h-2 rounded-lg ${
              isFilled ? "bg-green-500" : "bg-white"
            } ${index !== 4 ? "mr-1" : ""}`}
            style={{ width: `${100 / fractions}%` }}
          />
        );
      })}
    </div>
  );
};

export default FractionProgress;
