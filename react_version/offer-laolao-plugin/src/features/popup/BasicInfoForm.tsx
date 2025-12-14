import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"

import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Button } from "~components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import { DatePicker } from "~components/ui/date-picker"
import { basicInfoFields } from "~config/field-config"
import type { PersonalInfo } from "~types/resume"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import { defaultPersonalInfo } from "~types/resume"

// 表单验证 Schema
const personalInfoSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().min(1, "请输入手机号码"),
  email: z.string().email("请输入有效的邮箱地址").or(z.literal("")),
  idCard: z.string().optional(),
  location: z.string().optional(),
  politicalStatus: z.string().optional(),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

export function BasicInfoForm() {
  const [storedData, setStoredData, isLoading] = useStorage<{
    personalInfo: PersonalInfo
  }>(STORAGE_KEYS.RESUME_DATA, { personalInfo: defaultPersonalInfo })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultPersonalInfo,
  })

  // 从存储加载数据
  useEffect(() => {
    if (!isLoading && storedData?.personalInfo) {
      Object.entries(storedData.personalInfo).forEach(([key, value]) => {
        setValue(key as keyof PersonalInfoFormData, value || "")
      })
    }
  }, [isLoading, storedData, setValue])

  // 自动保存
  const formValues = watch()
  useEffect(() => {
    if (isDirty && !isLoading) {
      const timer = setTimeout(() => {
        setStoredData((prev) => ({
          ...prev,
          personalInfo: formValues as PersonalInfo,
        }))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formValues, isDirty, isLoading, setStoredData])

  const onSubmit = (data: PersonalInfoFormData) => {
    setStoredData((prev) => ({
      ...prev,
      personalInfo: data as PersonalInfo,
    }))
    console.log("Form saved:", data)
  }

  // 根据字段类型渲染对应的组件
  const renderField = (field: (typeof basicInfoFields)[0]) => {
    const fieldValue = formValues[field.id] || ""

    switch (field.type) {
      case "select":
        return (
          <Select
            value={fieldValue}
            onValueChange={(value) =>
              setValue(field.id, value === "empty" ? "" : value, { shouldDirty: true })
            }
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value || "empty"}
                  value={option.value || "empty"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "date":
        return (
          <DatePicker
            id={field.id}
            value={fieldValue}
            onChange={(value) => setValue(field.id, value, { shouldDirty: true })}
            placeholder={field.placeholder || "选择日期"}
          />
        )

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.id)}
          />
        )
    }
  }

  if (isLoading) {
    return (
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-py-8">
        <div className="plasmo-text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="plasmo-space-y-4">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-mb-4">
        <div className="plasmo-w-1 plasmo-h-5 plasmo-bg-primary plasmo-rounded" />
        <h3 className="plasmo-text-base plasmo-font-semibold plasmo-text-foreground">
          基本信息
        </h3>
      </div>

      <div className="plasmo-grid plasmo-gap-4">
        {basicInfoFields.map((field) => (
          <div key={field.id} className="plasmo-space-y-2">
            <Label htmlFor={field.id} className="plasmo-text-foreground">
              {field.label}
              {field.required && (
                <span className="plasmo-text-destructive plasmo-ml-1">*</span>
              )}
            </Label>

            {renderField(field)}

            {errors[field.id] && (
              <p className="plasmo-text-sm plasmo-text-destructive">
                {errors[field.id]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="plasmo-pt-4">
        <Button type="submit" className="plasmo-w-full">
          💾 保存基本信息
        </Button>
      </div>
    </form>
  )
}
