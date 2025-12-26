export type ErrorCode =
  | "BAD_REQUEST"
  | "BAD_REQUEST/INVALID_REQUEST_BODY"
  | "BAD_REQUEST/VALIDATION_ERROR"
  | "BAD_REQUEST/STOCK_INSUFFICIENT"
  | "BAD_REQUEST/INVENTORY_NOT_ASSIGNED"
  | "BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND"
  | "BAD_REQUEST/COLUMN_NOT_FOUND"
  | "BAD_REQUEST/PAYMENT_TOTAL_MISMATCH"
  | "BAD_REQUEST/RUNTIME_EXCEPTION"
  | "BAD_REQUEST/INVALID_CREDENTIALS"
  | "BAD_REQUEST/ACCOUNT_INACTIVE"
  | "BAD_REQUEST/ACCOUNT_NOT_VERIFIED"
  | "UNAUTHORIZED"
  | "UNAUTHORIZED/INVALID_TOKEN"
  | "UNAUTHORIZED/TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "FORBIDDEN/ACCESS_DENIED"
  | "NOT_FOUND"
  | "NOT_FOUND/RESOURCE_NOT_FOUND"
  | "NOT_FOUND/USER_NOT_FOUND"
  | "NOT_FOUND/PROFILE_NOT_FOUND"
  | "CONFLICT/DATA_INTEGRITY_VIOLATION"
  | "CONFLICT/UNIQUE_CONSTRAINT_VIOLATION"
  | "CONFLICT/EMAIL_ALREADY_EXISTS"
  | "CONFLICT/USERNAME_ALREADY_EXISTS"
  | "CONFLICT/FOREIGN_KEY_VIOLATION"
  | "MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING"
  | "MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL"
  | "SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED"
  | "SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR"
  | "SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED"
  | "SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED"
  | "GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT"
  | "GATEWAY_TIMEOUT/POOL_TIMEOUT"
  | "INTERNAL_SERVER_ERROR"
  | "INTERNAL_SERVER_ERROR/UNEXPECTED"
  | "INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING"
  | "METHOD_NOT_IMPLEMENTED"

export interface HumanizedError {
  title: string
  description: string
}

const PLAIN_HUMANIZED_ERRORS: Record<ErrorCode, HumanizedError> = {
  "BAD_REQUEST": {
    title: "Solicitud incorrecta",
    description: "La solicitud no pudo ser procesada debido a un error en los datos proporcionados.",
  },
  "BAD_REQUEST/INVALID_REQUEST_BODY": {
    title: "Campo inválido",
    description: "El campo proporcionado no es válido en la petición.",
  },
  "BAD_REQUEST/VALIDATION_ERROR": {
    title: "Error de validación",
    description: "Los datos proporcionados no cumplen con los requisitos de validación.",
  },
  "BAD_REQUEST/STOCK_INSUFFICIENT": {
    title: "Stock insuficiente",
    description: "No hay suficiente stock disponible para realizar esta operación.",
  },
  "BAD_REQUEST/INVENTORY_NOT_ASSIGNED": {
    title: "Inventario no asignado",
    description: "El recurso no tiene un inventario asignado.",
  },
  "BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND": {
    title: "Relación de esquema no encontrada",
    description: "La relación de esquema especificada no existe.",
  },
  "BAD_REQUEST/COLUMN_NOT_FOUND": {
    title: "Columna no encontrada",
    description: "La columna especificada no existe en la base de datos.",
  },
  "BAD_REQUEST/PAYMENT_TOTAL_MISMATCH": {
    title: "Monto total de pagos no coincide",
    description: "El monto total de pagos debe ser igual al total de la transacción.",
  },
  "BAD_REQUEST/RUNTIME_EXCEPTION": {
    title: "Error en tiempo de ejecución",
    description: "Ocurrió un error durante el procesamiento de la solicitud.",
  },
  "BAD_REQUEST/INVALID_CREDENTIALS": {
    title: "Credenciales inválidas",
    description: "Las credenciales proporcionadas son incorrectas.",
  },
  "BAD_REQUEST/ACCOUNT_INACTIVE": {
    title: "Cuenta inactiva",
    description: "Tu cuenta está inactiva. Por favor, contacta al administrador.",
  },
  "BAD_REQUEST/ACCOUNT_NOT_VERIFIED": {
    title: "Cuenta no verificada",
    description: "Tu cuenta no ha sido verificada. Por favor, verifica tu cuenta.",
  },
  "UNAUTHORIZED": {
    title: "No autorizado",
    description: "No estás autorizado para realizar esta acción.",
  },
  "UNAUTHORIZED/INVALID_TOKEN": {
    title: "Token inválido",
    description: "El token de autenticación proporcionado no es válido.",
  },
  "UNAUTHORIZED/TOKEN_EXPIRED": {
    title: "Token expirado",
    description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  },
  "FORBIDDEN": {
    title: "Acceso denegado",
    description: "No tienes permiso para acceder a este recurso.",
  },
  "FORBIDDEN/ACCESS_DENIED": {
    title: "Acceso denegado",
    description: "No tienes permiso para realizar esta acción.",
  },
  "NOT_FOUND": {
    title: "Recurso no encontrado",
    description: "El recurso solicitado no fue encontrado.",
  },
  "NOT_FOUND/RESOURCE_NOT_FOUND": {
    title: "Recurso no encontrado",
    description: "El recurso solicitado no existe.",
  },
  "NOT_FOUND/USER_NOT_FOUND": {
    title: "Usuario no encontrado",
    description: "No se encontró un usuario con los datos proporcionados.",
  },
  "NOT_FOUND/PROFILE_NOT_FOUND": {
    title: "Perfil no encontrado",
    description: "No se encontró el perfil solicitado.",
  },
  "CONFLICT/DATA_INTEGRITY_VIOLATION": {
    title: "Violación de integridad de datos",
    description: "Los datos proporcionados violan las reglas de integridad.",
  },
  "CONFLICT/UNIQUE_CONSTRAINT_VIOLATION": {
    title: "Error de duplicación de datos",
    description: "Ya existe un registro con los datos proporcionados.",
  },
  "CONFLICT/EMAIL_ALREADY_EXISTS": {
    title: "Correo electrónico ya existe",
    description: "Ya existe un usuario con el correo electrónico proporcionado.",
  },
  "CONFLICT/USERNAME_ALREADY_EXISTS": {
    title: "Nombre de usuario ya existe",
    description: "Ya existe un usuario con el nombre de usuario proporcionado.",
  },
  "CONFLICT/FOREIGN_KEY_VIOLATION": {
    title: "Violación de clave foránea",
    description: "El recurso está siendo utilizado por otro registro y no puede ser eliminado.",
  },
  "MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING": {
    title: "Elección ambigua de incrustación",
    description: "La incrustación solicitada es ambigua y no se puede resolver.",
  },
  "MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL": {
    title: "Llamada a función ambigua",
    description: "La llamada a la función solicitada es ambigua y no se puede resolver.",
  },
  "SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED": {
    title: "Servicio no disponible",
    description: "No se pudo conectar a la base de datos.",
  },
  "SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR": {
    title: "Error interno de la base de datos",
    description: "Ocurrió un error interno en la base de datos.",
  },
  "SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED": {
    title: "Error al construir la caché del esquema",
    description: "No se pudo construir la caché del esquema.",
  },
  "SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED": {
    title: "Error en la caché del esquema",
    description: "La caché del esquema no está disponible.",
  },
  "GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT": {
    title: "Tiempo de espera agotado",
    description: "La adquisición del pool de conexiones a la base de datos ha agotado el tiempo de espera.",
  },
  "GATEWAY_TIMEOUT/POOL_TIMEOUT": {
    title: "Tiempo de espera agotado",
    description: "La adquisición del pool de conexiones ha agotado el tiempo de espera.",
  },
  "INTERNAL_SERVER_ERROR": {
    title: "Error en el servidor",
    description: "Ocurrió un error inesperado en el servidor.",
  },
  "INTERNAL_SERVER_ERROR/UNEXPECTED": {
    title: "Error inesperado",
    description: "Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.",
  },
  "INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING": {
    title: "Error interno del servidor",
    description: "Falta la clave secreta del JWT en la configuración del servidor.",
  },
  "METHOD_NOT_IMPLEMENTED": {
    title: "Método no implementado",
    description: "El método no está implementado.",
  },
}

export function humanizeError(
  code: string | ErrorCode,
  message?: string,
  details?: Record<string, unknown>
): HumanizedError {
  // Intentar encontrar el error en el mapa
  const errorCode = code as ErrorCode
  const humanizedError = PLAIN_HUMANIZED_ERRORS[errorCode]

  if (humanizedError) {
    // Si hay un mensaje personalizado del servidor, usarlo como descripción
    if (message && message !== humanizedError.description) {
      return {
        title: humanizedError.title,
        description: message,
      }
    }
    return humanizedError
  }

  // Si no se encuentra el código, usar el mensaje del servidor o un mensaje genérico
  return {
    title: "Error",
    description: message || "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
  }
}

