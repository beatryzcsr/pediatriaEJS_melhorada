// Middleware que verifica se o usuário está autenticado antes de acessar uma rota.
export default function auth(req, res, next) {
 
    // Se não existir usuário salvo na sessão, significa que não houve login.
    if (!req.session.usuario) {
        // Envia o usuário para a página de login.
        return res.redirect('/login');
    }
 
    // Se existir usuário na sessão, permite continuar para a rota solicitada.
    next();
}
