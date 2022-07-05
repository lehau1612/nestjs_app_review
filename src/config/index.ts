export default {
    auth:{
        saltRound: String(process.env.SALT_ROUND),
    },
    valuePerformance:{
        self: Number(process.env.SELF_PERFROMANCE),
        manager:Number(process.env.MANAGER_PERFROMANCE)
    },
    valueBonus:{
        self: Number(process.env.SELF_BONUS),
        manager:Number(process.env.MANAGER_BONUS)
    },
    valueAttitudeTeamwork:{
        self:Number(process.env.SELF_ATTITUDE_TEAMWORK),
        manager: Number(process.env.MANAGER_ATTITUDE_TEAMWORK),
        partner: Number(process.env.PARTNER)
    },
    valueTotal:{
        performance: Number(process.env.POINT_PERFORMANCE),
        bonus: Number(process.env.POINT_BONUS),
        attitude: Number(process.env.POINT_ATTITUDE_TEAMWORK)
    }
}