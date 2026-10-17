export const ES_ERRORS_MESSAGES = {
  "errors.BAD_REQUEST.title": "Solicitud incorrecta",
  "errors.BAD_REQUEST.desc":
    "La solicitud no pudo ser procesada debido a un error en los datos proporcionados.",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.title": "Campo inválido",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.desc":
    "El campo proporcionado no es válido en la petición.",
  "errors.BAD_REQUEST/VALIDATION_ERROR.title": "Error de validación",
  "errors.BAD_REQUEST/VALIDATION_ERROR.desc":
    "Los datos proporcionados no cumplen con los requisitos de validación.",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.title": "Stock insuficiente",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.desc":
    "No hay suficiente stock disponible para realizar esta operación.",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.title": "Inventario no asignado",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.desc":
    "El recurso no tiene un inventario asignado.",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.title":
    "Relación de esquema no encontrada",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.desc":
    "La relación de esquema especificada no existe.",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.title": "Columna no encontrada",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.desc":
    "La columna especificada no existe en la base de datos.",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.title":
    "Monto total de pagos no coincide",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.desc":
    "El monto total de pagos debe ser igual al total de la transacción.",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.title": "Error en tiempo de ejecución",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.desc":
    "Ocurrió un error durante el procesamiento de la solicitud.",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.title": "Credenciales inválidas",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.desc":
    "Las credenciales proporcionadas son incorrectas.",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.title": "Cuenta inactiva",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.desc":
    "Tu cuenta está inactiva. Por favor, contacta al administrador.",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.title": "Cuenta no verificada",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.desc":
    "Tu cuenta no ha sido verificada. Por favor, verifica tu cuenta.",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.title": "Fondos insuficientes",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.desc":
    "No tienes saldo suficiente en la cuenta para realizar esta operación.",
  "errors.UNAUTHORIZED.title": "No autorizado",
  "errors.UNAUTHORIZED.desc": "No estás autorizado para realizar esta acción.",
  "errors.UNAUTHORIZED/INVALID_TOKEN.title": "Token inválido",
  "errors.UNAUTHORIZED/INVALID_TOKEN.desc":
    "El token de autenticación proporcionado no es válido.",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.title": "Token expirado",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.desc":
    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  "errors.FORBIDDEN.title": "Acceso denegado",
  "errors.FORBIDDEN.desc": "No tienes permiso para acceder a este recurso.",
  "errors.FORBIDDEN/ACCESS_DENIED.title": "Acceso denegado",
  "errors.FORBIDDEN/ACCESS_DENIED.desc":
    "No tienes permiso para realizar esta acción.",
  "errors.NOT_FOUND.title": "Recurso no encontrado",
  "errors.NOT_FOUND.desc": "El recurso solicitado no fue encontrado.",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.title": "Recurso no encontrado",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.desc":
    "El recurso solicitado no existe.",
  "errors.NOT_FOUND/USER_NOT_FOUND.title": "Usuario no encontrado",
  "errors.NOT_FOUND/USER_NOT_FOUND.desc":
    "No se encontró un usuario con los datos proporcionados.",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.title": "Perfil no encontrado",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.desc":
    "No se encontró el perfil solicitado.",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.title":
    "Violación de integridad de datos",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.desc":
    "Los datos proporcionados violan las reglas de integridad.",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.title":
    "Error de duplicación de datos",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.desc":
    "Ya existe un registro con los datos proporcionados.",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.title": "Correo electrónico ya existe",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.desc":
    "Ya existe un usuario con el correo electrónico proporcionado.",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.title":
    "Nombre de usuario ya existe",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.desc":
    "Ya existe un usuario con el nombre de usuario proporcionado.",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.title": "Violación de clave foránea",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.desc":
    "El recurso está siendo utilizado por otro registro y no puede ser eliminado.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.title":
    "Elección ambigua de incrustación",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.desc":
    "La incrustación solicitada es ambigua y no se puede resolver.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.title":
    "Llamada a función ambigua",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.desc":
    "La llamada a la función solicitada es ambigua y no se puede resolver.",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.title":
    "Servicio no disponible",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.desc":
    "No se pudo conectar a la base de datos.",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.title":
    "Error interno de la base de datos",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.desc":
    "Ocurrió un error interno en la base de datos.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.title":
    "Error al construir la caché del esquema",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.desc":
    "No se pudo construir la caché del esquema.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.title":
    "Error en la caché del esquema",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.desc":
    "La caché del esquema no está disponible.",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.title":
    "Tiempo de espera agotado",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.desc":
    "La adquisición del pool de conexiones a la base de datos ha agotado el tiempo de espera.",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.title": "Tiempo de espera agotado",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.desc":
    "La adquisición del pool de conexiones ha agotado el tiempo de espera.",
  "errors.INTERNAL_SERVER_ERROR.title": "Error en el servidor",
  "errors.INTERNAL_SERVER_ERROR.desc":
    "Ocurrió un error inesperado en el servidor.",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.title": "Error inesperado",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.desc":
    "Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.title":
    "Error interno del servidor",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.desc":
    "Falta la clave secreta del JWT en la configuración del servidor.",
  "errors.METHOD_NOT_IMPLEMENTED.title": "Método no implementado",
  "errors.METHOD_NOT_IMPLEMENTED.desc": "El método no está implementado.",
  "errors.field.transactionDate": "Fecha de transacción",
  "errors.field.amount": "Monto",
  "errors.field.amountCents": "Monto",
  "errors.field.description": "Descripción",
  "errors.field.categoryId": "Categoría",
  "errors.field.accountId": "Cuenta",
  "errors.field.name": "Nombre",
  "errors.field.categoryType": "Tipo de categoría",
  "errors.field.email": "Correo electrónico",
  "errors.field.username": "Nombre de usuario",
  "errors.field.password": "Contraseña",
  "errors.generic.title": "Error",
  "errors.unknown.title": "Error desconocido",
  "errors.unknown.desc":
    "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
  "errors.notVerified.title": "Cuenta no verificada",
  "errors.notVerified.desc":
    "Tu cuenta aún no ha sido verificada. Revisa tu correo o reenvía el correo de confirmación para poder iniciar sesión.",
  "errors.insufficientFunds.detail":
    "No tienes saldo suficiente en la cuenta. Saldo disponible: {available}. Monto de la transacción/transferencia: {amount}.",
} as const

export const EN_ERRORS_MESSAGES: Record<
  keyof typeof ES_ERRORS_MESSAGES,
  string
> = {
  "errors.BAD_REQUEST.title": "Bad request",
  "errors.BAD_REQUEST.desc":
    "The request could not be processed because of an error in the data provided.",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.title": "Invalid field",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.desc":
    "The field provided is not valid in the request.",
  "errors.BAD_REQUEST/VALIDATION_ERROR.title": "Validation error",
  "errors.BAD_REQUEST/VALIDATION_ERROR.desc":
    "The data provided does not meet the validation requirements.",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.title": "Insufficient stock",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.desc":
    "There is not enough stock available to perform this operation.",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.title": "Inventory not assigned",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.desc":
    "The resource has no inventory assigned.",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.title":
    "Schema relation not found",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.desc":
    "The specified schema relation does not exist.",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.title": "Column not found",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.desc":
    "The specified column does not exist in the database.",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.title":
    "Payment total does not match",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.desc":
    "The total amount of payments must equal the transaction total.",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.title": "Runtime error",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.desc":
    "An error occurred while processing the request.",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.title": "Invalid credentials",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.desc":
    "The credentials provided are incorrect.",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.title": "Inactive account",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.desc":
    "Your account is inactive. Please contact the administrator.",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.title": "Account not verified",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.desc":
    "Your account has not been verified. Please verify your account.",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.title": "Insufficient funds",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.desc":
    "You do not have enough balance in the account to perform this operation.",
  "errors.UNAUTHORIZED.title": "Unauthorized",
  "errors.UNAUTHORIZED.desc": "You are not authorized to perform this action.",
  "errors.UNAUTHORIZED/INVALID_TOKEN.title": "Invalid token",
  "errors.UNAUTHORIZED/INVALID_TOKEN.desc":
    "The authentication token provided is not valid.",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.title": "Token expired",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.desc":
    "Your session has expired. Please sign in again.",
  "errors.FORBIDDEN.title": "Access denied",
  "errors.FORBIDDEN.desc":
    "You do not have permission to access this resource.",
  "errors.FORBIDDEN/ACCESS_DENIED.title": "Access denied",
  "errors.FORBIDDEN/ACCESS_DENIED.desc":
    "You do not have permission to perform this action.",
  "errors.NOT_FOUND.title": "Resource not found",
  "errors.NOT_FOUND.desc": "The requested resource was not found.",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.title": "Resource not found",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.desc":
    "The requested resource does not exist.",
  "errors.NOT_FOUND/USER_NOT_FOUND.title": "User not found",
  "errors.NOT_FOUND/USER_NOT_FOUND.desc":
    "No user was found with the data provided.",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.title": "Profile not found",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.desc":
    "The requested profile was not found.",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.title": "Data integrity violation",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.desc":
    "The data provided violates the integrity rules.",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.title": "Duplicate data",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.desc":
    "A record with the data provided already exists.",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.title": "Email already exists",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.desc":
    "A user with the email provided already exists.",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.title": "Username already exists",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.desc":
    "A user with the username provided already exists.",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.title": "Foreign key violation",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.desc":
    "The resource is used by another record and cannot be deleted.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.title": "Ambiguous embedding",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.desc":
    "The requested embedding is ambiguous and cannot be resolved.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.title":
    "Ambiguous function call",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.desc":
    "The requested function call is ambiguous and cannot be resolved.",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.title":
    "Service unavailable",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.desc":
    "Could not connect to the database.",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.title":
    "Internal database error",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.desc":
    "An internal database error occurred.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.title":
    "Schema cache build failed",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.desc":
    "The schema cache could not be built.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.title": "Schema cache error",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.desc":
    "The schema cache is not available.",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.title": "Timeout",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.desc":
    "Acquiring a database connection from the pool timed out.",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.title": "Timeout",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.desc":
    "Acquiring a connection from the pool timed out.",
  "errors.INTERNAL_SERVER_ERROR.title": "Server error",
  "errors.INTERNAL_SERVER_ERROR.desc": "An unexpected server error occurred.",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.title": "Unexpected error",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.desc":
    "An unexpected error occurred. Please try again later.",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.title":
    "Internal server error",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.desc":
    "The JWT secret key is missing from the server configuration.",
  "errors.METHOD_NOT_IMPLEMENTED.title": "Method not implemented",
  "errors.METHOD_NOT_IMPLEMENTED.desc": "The method is not implemented.",
  "errors.field.transactionDate": "Transaction date",
  "errors.field.amount": "Amount",
  "errors.field.amountCents": "Amount",
  "errors.field.description": "Description",
  "errors.field.categoryId": "Category",
  "errors.field.accountId": "Account",
  "errors.field.name": "Name",
  "errors.field.categoryType": "Category type",
  "errors.field.email": "Email",
  "errors.field.username": "Username",
  "errors.field.password": "Password",
  "errors.generic.title": "Error",
  "errors.unknown.title": "Unknown error",
  "errors.unknown.desc": "An unexpected error occurred. Please try again.",
  "errors.notVerified.title": "Account not verified",
  "errors.notVerified.desc":
    "Your account has not been verified yet. Check your email or resend the confirmation email to sign in.",
  "errors.insufficientFunds.detail":
    "You do not have enough balance in the account. Available balance: {available}. Transaction/transfer amount: {amount}.",
}

export const PT_ERRORS_MESSAGES: Record<
  keyof typeof ES_ERRORS_MESSAGES,
  string
> = {
  "errors.BAD_REQUEST.title": "Requisição inválida",
  "errors.BAD_REQUEST.desc":
    "A requisição não pôde ser processada devido a um erro nos dados fornecidos.",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.title": "Campo inválido",
  "errors.BAD_REQUEST/INVALID_REQUEST_BODY.desc":
    "O campo fornecido não é válido na requisição.",
  "errors.BAD_REQUEST/VALIDATION_ERROR.title": "Erro de validação",
  "errors.BAD_REQUEST/VALIDATION_ERROR.desc":
    "Os dados fornecidos não atendem aos requisitos de validação.",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.title": "Estoque insuficiente",
  "errors.BAD_REQUEST/STOCK_INSUFFICIENT.desc":
    "Não há estoque suficiente disponível para realizar esta operação.",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.title": "Inventário não atribuído",
  "errors.BAD_REQUEST/INVENTORY_NOT_ASSIGNED.desc":
    "O recurso não tem um inventário atribuído.",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.title":
    "Relação de esquema não encontrada",
  "errors.BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND.desc":
    "A relação de esquema especificada não existe.",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.title": "Coluna não encontrada",
  "errors.BAD_REQUEST/COLUMN_NOT_FOUND.desc":
    "A coluna especificada não existe no banco de dados.",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.title":
    "O total dos pagamentos não confere",
  "errors.BAD_REQUEST/PAYMENT_TOTAL_MISMATCH.desc":
    "O valor total dos pagamentos deve ser igual ao total da transação.",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.title": "Erro em tempo de execução",
  "errors.BAD_REQUEST/RUNTIME_EXCEPTION.desc":
    "Ocorreu um erro durante o processamento da requisição.",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.title": "Credenciais inválidas",
  "errors.BAD_REQUEST/INVALID_CREDENTIALS.desc":
    "As credenciais fornecidas estão incorretas.",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.title": "Conta inativa",
  "errors.BAD_REQUEST/ACCOUNT_INACTIVE.desc":
    "Sua conta está inativa. Entre em contato com o administrador.",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.title": "Conta não verificada",
  "errors.BAD_REQUEST/ACCOUNT_NOT_VERIFIED.desc":
    "Sua conta não foi verificada. Verifique sua conta.",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.title": "Saldo insuficiente",
  "errors.BAD_REQUEST/INSUFFICIENT_FUNDS.desc":
    "Você não tem saldo suficiente na conta para realizar esta operação.",
  "errors.UNAUTHORIZED.title": "Não autorizado",
  "errors.UNAUTHORIZED.desc": "Você não está autorizado a realizar esta ação.",
  "errors.UNAUTHORIZED/INVALID_TOKEN.title": "Token inválido",
  "errors.UNAUTHORIZED/INVALID_TOKEN.desc":
    "O token de autenticação fornecido não é válido.",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.title": "Token expirado",
  "errors.UNAUTHORIZED/TOKEN_EXPIRED.desc":
    "Sua sessão expirou. Faça login novamente.",
  "errors.FORBIDDEN.title": "Acesso negado",
  "errors.FORBIDDEN.desc": "Você não tem permissão para acessar este recurso.",
  "errors.FORBIDDEN/ACCESS_DENIED.title": "Acesso negado",
  "errors.FORBIDDEN/ACCESS_DENIED.desc":
    "Você não tem permissão para realizar esta ação.",
  "errors.NOT_FOUND.title": "Recurso não encontrado",
  "errors.NOT_FOUND.desc": "O recurso solicitado não foi encontrado.",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.title": "Recurso não encontrado",
  "errors.NOT_FOUND/RESOURCE_NOT_FOUND.desc":
    "O recurso solicitado não existe.",
  "errors.NOT_FOUND/USER_NOT_FOUND.title": "Usuário não encontrado",
  "errors.NOT_FOUND/USER_NOT_FOUND.desc":
    "Nenhum usuário foi encontrado com os dados fornecidos.",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.title": "Perfil não encontrado",
  "errors.NOT_FOUND/PROFILE_NOT_FOUND.desc":
    "O perfil solicitado não foi encontrado.",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.title":
    "Violação de integridade de dados",
  "errors.CONFLICT/DATA_INTEGRITY_VIOLATION.desc":
    "Os dados fornecidos violam as regras de integridade.",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.title": "Dados duplicados",
  "errors.CONFLICT/UNIQUE_CONSTRAINT_VIOLATION.desc":
    "Já existe um registro com os dados fornecidos.",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.title": "E-mail já existe",
  "errors.CONFLICT/EMAIL_ALREADY_EXISTS.desc":
    "Já existe um usuário com o e-mail fornecido.",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.title": "Nome de usuário já existe",
  "errors.CONFLICT/USERNAME_ALREADY_EXISTS.desc":
    "Já existe um usuário com o nome de usuário fornecido.",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.title":
    "Violação de chave estrangeira",
  "errors.CONFLICT/FOREIGN_KEY_VIOLATION.desc":
    "O recurso está sendo usado por outro registro e não pode ser excluído.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.title": "Incorporação ambígua",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING.desc":
    "A incorporação solicitada é ambígua e não pode ser resolvida.",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.title":
    "Chamada de função ambígua",
  "errors.MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL.desc":
    "A chamada de função solicitada é ambígua e não pode ser resolvida.",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.title":
    "Serviço indisponível",
  "errors.SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED.desc":
    "Não foi possível conectar ao banco de dados.",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.title":
    "Erro interno do banco de dados",
  "errors.SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR.desc":
    "Ocorreu um erro interno no banco de dados.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.title":
    "Erro ao construir o cache do esquema",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED.desc":
    "Não foi possível construir o cache do esquema.",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.title":
    "Erro no cache do esquema",
  "errors.SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED.desc":
    "O cache do esquema não está disponível.",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.title": "Tempo esgotado",
  "errors.GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT.desc":
    "A obtenção de uma conexão do pool do banco de dados excedeu o tempo limite.",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.title": "Tempo esgotado",
  "errors.GATEWAY_TIMEOUT/POOL_TIMEOUT.desc":
    "A obtenção de uma conexão do pool excedeu o tempo limite.",
  "errors.INTERNAL_SERVER_ERROR.title": "Erro no servidor",
  "errors.INTERNAL_SERVER_ERROR.desc":
    "Ocorreu um erro inesperado no servidor.",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.title": "Erro inesperado",
  "errors.INTERNAL_SERVER_ERROR/UNEXPECTED.desc":
    "Ocorreu um erro inesperado. Tente novamente mais tarde.",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.title":
    "Erro interno do servidor",
  "errors.INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING.desc":
    "A chave secreta do JWT está ausente na configuração do servidor.",
  "errors.METHOD_NOT_IMPLEMENTED.title": "Método não implementado",
  "errors.METHOD_NOT_IMPLEMENTED.desc": "O método não está implementado.",
  "errors.field.transactionDate": "Data da transação",
  "errors.field.amount": "Valor",
  "errors.field.amountCents": "Valor",
  "errors.field.description": "Descrição",
  "errors.field.categoryId": "Categoria",
  "errors.field.accountId": "Conta",
  "errors.field.name": "Nome",
  "errors.field.categoryType": "Tipo de categoria",
  "errors.field.email": "E-mail",
  "errors.field.username": "Nome de usuário",
  "errors.field.password": "Senha",
  "errors.generic.title": "Erro",
  "errors.unknown.title": "Erro desconhecido",
  "errors.unknown.desc": "Ocorreu um erro inesperado. Tente novamente.",
  "errors.notVerified.title": "Conta não verificada",
  "errors.notVerified.desc":
    "Sua conta ainda não foi verificada. Verifique seu e-mail ou reenvie o e-mail de confirmação para fazer login.",
  "errors.insufficientFunds.detail":
    "Você não tem saldo suficiente na conta. Saldo disponível: {available}. Valor da transação/transferência: {amount}.",
}
