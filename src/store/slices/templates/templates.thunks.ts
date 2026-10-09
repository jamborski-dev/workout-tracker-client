import {
  createTemplate,
  createTemplateFromRoutine,
  deleteTemplate,
  getAllTemplates,
  updateTemplate
} from "@root/services/templates.service"
import type { IDType, RoutineTemplate, TemplatePayload } from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllTemplatesAction = createThunk<undefined, RoutineTemplate[]>(
  "templates/getAll",
  getAllTemplates
)

export const createTemplateAction = createThunk<
  { fromRoutineId: IDType; name?: string },
  RoutineTemplate
>("templates/create", createTemplateFromRoutine)

export const createTemplateFromScratchAction = createThunk<Required<TemplatePayload>, RoutineTemplate>(
  "templates/createFromScratch",
  createTemplate
)

export const updateTemplateAction = createThunk<
  { templateId: IDType; payload: TemplatePayload },
  RoutineTemplate
>("templates/update", updateTemplate)

export const deleteTemplateAction = createThunk<{ templateId: IDType }, undefined>(
  "templates/delete",
  deleteTemplate
)
