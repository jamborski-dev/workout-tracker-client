import {
  createTemplateFromRoutine,
  deleteTemplate,
  getAllTemplates,
  updateTemplate
} from "@root/services/templates.service"
import type { IDType, RoutineTemplate } from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllTemplatesAction = createThunk<undefined, RoutineTemplate[]>(
  "templates/getAll",
  getAllTemplates
)

export const createTemplateAction = createThunk<
  { fromRoutineId: IDType; name?: string },
  RoutineTemplate
>("templates/create", createTemplateFromRoutine)

export const updateTemplateAction = createThunk<
  { templateId: IDType; payload: { name?: string; routineTypeId?: IDType } },
  RoutineTemplate
>("templates/update", updateTemplate)

export const deleteTemplateAction = createThunk<{ templateId: IDType }, undefined>(
  "templates/delete",
  deleteTemplate
)
