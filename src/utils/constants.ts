import { CronExpression } from "@nestjs/schedule";

export const cronJobSchedules: { id: number, value: string, label: string }[] = [
    {
        id: 1,
        value: CronExpression.EVERY_MINUTE,
        label: 'Every 5 minutes'
    },
    {
        id: 2,
        value: CronExpression.EVERY_6_HOURS,
        label: 'Every 6 hours'
    },
    {
        id: 3,
        value: CronExpression.EVERY_DAY_AT_MIDNIGHT,
        label: 'Every day, at midnight'
    },
    {
        id: 3,
        value: CronExpression.EVERY_WEEK,
        label: 'Every week, at midnight'
    },
    {
        id: 4,
        value: CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT,
        label: 'Every month, on the 1st day at midnight'
    }
];