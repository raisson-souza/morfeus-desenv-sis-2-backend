import { createSleepValidator, updateSleepValidator } from '#validators/sleep'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { paginationValidator } from '#validators/system'
import CustomException from '#exceptions/custom_exception'
import Sleep from '#models/sleep'
import SleepService from '#services/sleep_service'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SleepController {
    constructor(protected sleepService : SleepService) { }

    async create({ request, response }: HttpContext) : Promise<void> {
        const sleep = await request.validateUsing(createSleepValidator)
        await this.sleepService.Create({
            userId: sleep.userId,
            date: DateTime.fromJSDate(sleep.date),
            sleepTime: sleep.userId,
            sleepStart: DateTime.fromJSDate(sleep.sleepStart),
            sleepEnd: DateTime.fromJSDate(sleep.sleepEnd),
            wakeUpHumor: sleep.wakeUpHumor,
            layDownHumor: sleep.layDownHumor,
            biologicalOccurences: sleep.biologicalOccurences,
        })
        response.status(201).json("Sono criado com sucesso.")
    }

    async update({ request, response }: HttpContext) : Promise<void> {
        const sleep = await request.validateUsing(updateSleepValidator)
        await this.sleepService.Update({
            userId: sleep.userId,
            id: sleep.id,
            date: DateTime.fromJSDate(sleep.date),
            sleepTime: sleep.userId,
            sleepStart: DateTime.fromJSDate(sleep.sleepStart),
            sleepEnd: DateTime.fromJSDate(sleep.sleepEnd),
            wakeUpHumor: sleep.wakeUpHumor,
            layDownHumor: sleep.layDownHumor,
            biologicalOccurences: sleep.biologicalOccurences,
        })
        response.status(201).json("Sono atualizado com sucesso.")
    }

    async get({ params }: HttpContext) : Promise<Sleep | null> {
        const { id } = params
        const sleep = await this.sleepService.Get(Number.parseInt(id ?? 0))
        if (!sleep) throw new CustomException(404, "Sono não encontrado.")
        return sleep!
    }

    async list({ request }: HttpContext) : Promise<ModelPaginatorContract<Sleep>> {
        const { page, limit = 10, orderBy = "id", orderByDirection = "desc" } = await request.validateUsing(paginationValidator)
        return await this.sleepService.List({ page, limit, orderBy, orderByDirection: orderByDirection as any })
    }

    async delete({ params, response }: HttpContext) : Promise<void> {
        const { id } = params
        await this.sleepService.Delete(id)
        response.status(201).json("Sono deletado com sucesso.")
    }

    async listByUser({ params, request }: HttpContext): Promise<ModelPaginatorContract<Sleep>> {
        const { id } = params
        const { page, limit = 10, orderBy = "id", orderByDirection = "desc" } = await request.validateUsing(paginationValidator)
        return this.sleepService.ListByUser(
            { page, limit, orderBy, orderByDirection: orderByDirection as any },
            id
        )
    }
}