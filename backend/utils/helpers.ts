export const generateNumeroCommande = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `CMD${year}${month}${day}${random}`;
};

export const calculateMontantTotal = (details: Array<{ quantite: number; prixUnitaire: number }>): number => {
  return details.reduce((total, detail) => {
    return total + (detail.quantite * detail.prixUnitaire);
  }, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T, allowedFields: string[]): Partial<T> => {
  return Object.keys(obj)
    .filter(key => allowedFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as any);
};

export const getPagination = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const getPaginationData = (data: any, page: number, limit: number) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
