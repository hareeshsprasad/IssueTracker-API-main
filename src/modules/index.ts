export const indexFunction = async (req: any, res: any) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Node API Running'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};