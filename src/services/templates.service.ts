import type { IDType, RoutineTemplate, TemplatePayload } from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const getAllTemplates = async () => {
  return await secureServiceCall<undefined, RoutineTemplate[]>({
    method: "get",
    path: "/fit/templates",
    errorMessage: "Failed to fetch templates"
  })
}

export const createTemplateFromRoutine = async (params: { fromRoutineId: IDType; name?: string }) => {
  return await secureServiceCall<typeof params, RoutineTemplate>({
    method: "post",
    path: "/fit/templates",
    params,
    errorMessage: "Failed to save template"
  })
}

// Build a template from scratch
export const createTemplate = async (params: Required<TemplatePayload>) => {
  return await secureServiceCall<typeof params, RoutineTemplate>({
    method: "post",
    path: "/fit/templates",
    params,
    errorMessage: "Failed to save template"
  })
}

export const updateTemplate = async (params: { templateId: IDType; payload: TemplatePayload }) => {
  const { templateId, payload } = params
  return await secureServiceCall<typeof payload, RoutineTemplate>({
    method: "patch",
    path: `/fit/templates/${templateId}`,
    params: payload,
    errorMessage: "Failed to update template"
  })
}

export const deleteTemplate = async (params: { templateId: IDType }) => {
  const { templateId } = params
  return await secureServiceCall<undefined, undefined>({
    method: "delete",
    path: `/fit/templates/${templateId}`,
    errorMessage: "Failed to delete template"
  })
}
