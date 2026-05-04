// src/components/home/features-section.tsx
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "شحن مجاني",
    description: "شحن مجاني لجميع الطلبات فوق \$100",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "دفع آمن",
    description: "معاملات مشفرة وآمنة 100%",
    color: "bg-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: RotateCcw,
    title: "إرجاع مجاني",
    description: "إرجاع مجاني خلال 30 يوم",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Headphones,
    title: "دعم 24/7",
    description: "فريق دعم متاح على مدار الساعة",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 text-center card-hover border border-gray-100"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`w-7 h-7 ${feature.color.replace("bg-", "text-")}`} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}