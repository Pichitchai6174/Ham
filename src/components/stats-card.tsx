
type StatsCardProps = {
    title: string
    value?: number
    valueText?: string
    dateText?: string
}

export default function StatsCard({ title, value, dateText }: StatsCardProps) {

    const colorMap: Record<string, string> = {
        "ผู้ประเมินทั้งหมด": "from-cyan-400 to-blue-500",
        "ความคลาดเคลื่อน": "from-red-400 to-red-500",
        "ปฏิบัติครบถ้วนตามแนวทาง": "from-green-400 to-green-500",
        "คะแนนเฉลี่ยรวม 14 ด้าน": "from-violet-400 to-purple-500",
    }

    const gradient = colorMap[title] ?? "from-cyan-400 to-blue-500"


    return (
        <div className="bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-700 flex flex-col items-start justify-center transform hover:scale-[1.01] transition duration-300 group">
            <div className="text-gray-400 font-light text-lg">{title}</div>

            <div className={`text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r ${gradient} mb-2 group-hover:scale-110 transition-transform`}>
                {value}
            </div>

            {dateText && (
                <p className="text-gray-400 text-sm font-light">{dateText}</p>
            )}
        </div>
    )
}
