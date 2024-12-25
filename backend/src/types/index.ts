import { PropertyType, ExpenseType, RentalStatus, PropertyStatus, PortfolioRole, User } from '@prisma/client'
import { UUID } from 'crypto';


export interface UserPayload {
    name: string;
    email: string;
    role: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface PropertyCreateDTO {
    name: string
    description?: string
    type: PropertyType
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    purchasePrice: number
    currentValue: number
    purchaseDate: Date
}

export interface PropertyExpenseDTO {
    propertyId: string
    type: ExpenseType
    amount: number
    date: Date
    description?: string
    vendor?: string
}

export type FinancialTransaction = {
    amount: number;
    date: Date;
    description: string;
    category: 'INCOME' | 'EXPENSE';
    type: string;
    relatedDocumentId?: string;
};

export type CashflowReport = {
    startDate: Date;
    endDate: Date;
    propertyIds?: string[];
};

export interface LogEntry {
    type: 'MAINTENANCE' | 'INSPECTION' | 'RENOVATION' | 'INCIDENT' | 'OTHER';
    description: string;
    cost?: number;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedTo?: string;
    completionDate?: Date;
}

export interface PropertyCreateDTO {
    name: string
    description?: string
    type: PropertyType
    status: PropertyStatus
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    purchasePrice: number
    currentValue: number
    purchaseDate: Date
}

// Update Property DTO
export interface PropertyUpdateDTO {
    purchasePrice: any;
    name?: string
    description?: string
    status?: PropertyStatus
    currentValue?: number
    appreciationRate?: number
    monthlyRent?: number
    rentalStatus?: RentalStatus
}

// Property Expense DTO
export interface PropertyExpenseDTO {
    propertyId: string
    type: ExpenseType
    amount: number
    date: Date
    description?: string
    vendor?: string
}

// Rental Agreement DTO
export interface RentalAgreementDTO {
    propertyId: string
    tenantName: string
    startDate: Date
    endDate: Date
    monthlyRent: number
    securityDeposit: number
}

// Maintenance Log DTO
export interface MaintenanceLogDTO {
    propertyId: string
    description: string
    cost: number
    date: Date
    performedBy?: string
}

// Property Search Filters
export interface PropertySearchFilters {
    minPrice?: number
    maxPrice?: number
    location?: string
    propertyTypes?: PropertyType[]
    rentalStatus?: RentalStatus
    page?: number
    limit?: number
}

// Response Types
export interface PaginatedResponse<T> {
    items: T[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

// Performance Report Types
export interface PropertyPerformanceMetrics {
    totalRevenue: number
    totalExpenses: number
    netIncome: number
    roi: number
    occupancyRate: number
}

export interface PropertyReport {
    propertyDetails: {
        id: string
        name: string
        type: PropertyType
        address: string
        purchasePrice: number
        currentValue: number
    }
    financials: {
        totalExpenses: number
        expensesByType: Record<ExpenseType, number>
        monthlyRent: number
        annualRent: number
        netIncome: number
        roi: number
    }
    occupancy: {
        status: RentalStatus
        currentTenant: string | null
        leaseEnd: Date | null
    }
    maintenance: {
        recentLogs: MaintenanceLogDTO[]
        totalLogs: number
    }
}


export interface Portfolio {
    id: number;
    name: string;
    created_at: Date;
}

export interface PortfolioMember extends User {
    portfolioId: string;
    userId: string;
    memberRole: PortfolioRole;
}

export interface PortfolioActivity {
    id: number;
    portfolio_id: number;
    user_id: number;
    action_type: string;
    details: any;
    created_at: Date;
}

export interface PropIds { id: UUID }

export interface LineChartData {
    reportPeriod: Date;
    totalrevenue: number;
    totalexpenses: number;
    netincome: number;
    occupancyrate: number;
}

export interface BarChartData {
    amount: number,
    date: Date
}