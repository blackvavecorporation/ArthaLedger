export function EnquiryChart({
  data,
}: {
  data: { label: string; full: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((item) => item.count));
  return (
    <div>
      <div className="flex h-40 items-end gap-2" role="img" aria-label="Enquiries received over the last 14 days">
        {data.map((item) => (
          <div key={item.full} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[0.6rem] font-medium text-navy-400 opacity-0 transition-opacity group-hover:opacity-100">
              {item.count}
            </span>
            <div
              className={`w-full rounded-t-sm transition-colors ${
                item.count > 0 ? "bg-navy-800 group-hover:bg-gold-500" : "bg-navy-100"
              }`}
              style={{ height: `${Math.max(3, (item.count / max) * 100)}%` }}
              title={`${item.full}: ${item.count} enquiry${item.count === 1 ? "" : "ies"}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((item) => (
          <span key={item.full} className="flex-1 text-center text-[0.55rem] text-navy-300">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
