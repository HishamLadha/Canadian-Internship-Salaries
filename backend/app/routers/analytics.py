from fastapi import APIRouter, Depends
from sqlmodel import select, Session, func, desc, asc, case
from typing import List, Dict, Any
from ..models.salary import ReportedSalary
from ..database import get_session
from pydantic import BaseModel
import statistics

router = APIRouter(prefix="/analytics", tags=["analytics"])

class SalaryTrendData(BaseModel):
    year: int
    avg_salary: float
    median_salary: float
    count: int

class CompanyStatsData(BaseModel):
    company: str
    avg_salary: float
    total_reports: int
    salary_range_min: float
    salary_range_max: float

class UniversityStatsData(BaseModel):
    university: str
    avg_salary: float
    total_reports: int

class LocationStatsData(BaseModel):
    location: str
    avg_salary: float
    total_reports: int

class RoleStatsData(BaseModel):
    role: str
    avg_salary: float
    total_reports: int

class SalaryDistributionData(BaseModel):
    salary_range: str
    count: int
    percentage: float

class AnalyticsOverview(BaseModel):
    total_reports: int
    avg_salary: float
    median_salary: float
    top_paying_company: str
    top_paying_company_avg: float
    most_reported_company: str
    most_reported_company_count: int
    total_companies: int
    total_universities: int
    total_locations: int

class YearlyGrowthData(BaseModel):
    year: int
    total_reports: int
    growth_rate: float

class SalaryByTermData(BaseModel):
    term: int
    avg_salary: float
    total_reports: int

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(session: Session = Depends(get_session)):
    """Get overall analytics overview with key metrics"""
    
    total_reports = session.exec(select(func.count()).select_from(ReportedSalary)).one()
    
    avg_salary = session.exec(select(func.avg(ReportedSalary.salary))).one() or 0.0
    
    all_salaries = session.exec(select(ReportedSalary.salary).order_by(ReportedSalary.salary)).all()
    median_salary = statistics.median(all_salaries) if all_salaries else 0.0
    
    top_paying_company = session.exec(
        select(ReportedSalary.company, func.avg(ReportedSalary.salary))
        .group_by(ReportedSalary.company)
        .having(func.count(ReportedSalary.id) >= 3)
        .order_by(func.avg(ReportedSalary.salary).desc())
        .limit(1)
    ).first()
    
    most_reported_company = session.exec(
        select(ReportedSalary.company, func.count(ReportedSalary.id))
        .group_by(ReportedSalary.company)
        .order_by(func.count(ReportedSalary.id).desc())
        .limit(1)
    ).first()
    
    total_companies = session.exec(select(func.count(func.distinct(ReportedSalary.company)))).one()
    total_universities = session.exec(select(func.count(func.distinct(ReportedSalary.university)))).one()
    total_locations = session.exec(select(func.count(func.distinct(ReportedSalary.location)))).one()
    
    return AnalyticsOverview(
        total_reports=total_reports,
        avg_salary=round(avg_salary, 2),
        median_salary=round(median_salary, 2),
        top_paying_company=top_paying_company[0] if top_paying_company else "N/A",
        top_paying_company_avg=round(top_paying_company[1], 2) if top_paying_company else 0.0,
        most_reported_company=most_reported_company[0] if most_reported_company else "N/A",
        most_reported_company_count=most_reported_company[1] if most_reported_company else 0,
        total_companies=total_companies,
        total_universities=total_universities,
        total_locations=total_locations
    )

@router.get("/salary-trends", response_model=List[SalaryTrendData])
def get_salary_trends(session: Session = Depends(get_session)):
    """Get salary trends over years"""
    
    yearly_data = session.exec(
        select(
            ReportedSalary.year,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id)
        )
        .group_by(ReportedSalary.year)
        .order_by(ReportedSalary.year)
    ).all()
    
    result = []
    for year, avg_salary, count in yearly_data:
        year_salaries = session.exec(
            select(ReportedSalary.salary)
            .where(ReportedSalary.year == year)
            .order_by(ReportedSalary.salary)
        ).all()
        
        median_salary = statistics.median(year_salaries) if year_salaries else 0.0
        
        result.append(SalaryTrendData(
            year=year,
            avg_salary=round(avg_salary, 2),
            median_salary=round(median_salary, 2),
            count=count
        ))
    
    return result

@router.get("/top-companies", response_model=List[CompanyStatsData])
def get_top_companies(limit: int = 15, session: Session = Depends(get_session)):
    """Get top companies by average salary with minimum report count"""
    
    company_stats = session.exec(
        select(
            ReportedSalary.company,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id),
            func.min(ReportedSalary.salary),
            func.max(ReportedSalary.salary)
        )
        .group_by(ReportedSalary.company)
        .having(func.count(ReportedSalary.id) >= 2)
        .order_by(func.avg(ReportedSalary.salary).desc())
        .limit(limit)
    ).all()
    
    return [
        CompanyStatsData(
            company=company,
            avg_salary=round(avg_salary, 2),
            total_reports=count,
            salary_range_min=round(min_salary, 2),
            salary_range_max=round(max_salary, 2)
        )
        for company, avg_salary, count, min_salary, max_salary in company_stats
    ]

@router.get("/top-universities", response_model=List[UniversityStatsData])
def get_top_universities(limit: int = 10, session: Session = Depends(get_session)):
    """Get top universities by average salary"""
    
    university_stats = session.exec(
        select(
            ReportedSalary.university,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id)
        )
        .group_by(ReportedSalary.university)
        .having(func.count(ReportedSalary.id) >= 3)
        .order_by(func.avg(ReportedSalary.salary).desc())
        .limit(limit)
    ).all()
    
    return [
        UniversityStatsData(
            university=university,
            avg_salary=round(avg_salary, 2),
            total_reports=count
        )
        for university, avg_salary, count in university_stats
    ]

@router.get("/top-locations", response_model=List[LocationStatsData])
def get_top_locations(limit: int = 10, session: Session = Depends(get_session)):
    """Get top locations by average salary"""
    
    location_stats = session.exec(
        select(
            ReportedSalary.location,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id)
        )
        .where(ReportedSalary.location.is_not(None))
        .where(ReportedSalary.location != "")
        .group_by(ReportedSalary.location)
        .having(func.count(ReportedSalary.id) >= 2)
        .order_by(func.avg(ReportedSalary.salary).desc())
        .limit(limit)
    ).all()
    
    return [
        LocationStatsData(
            location=location,
            avg_salary=round(avg_salary, 2),
            total_reports=count
        )
        for location, avg_salary, count in location_stats
    ]

@router.get("/top-roles", response_model=List[RoleStatsData])
def get_top_roles(limit: int = 10, session: Session = Depends(get_session)):
    """Get top roles by average salary"""
    
    role_stats = session.exec(
        select(
            ReportedSalary.role,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id)
        )
        .group_by(ReportedSalary.role)
        .having(func.count(ReportedSalary.id) >= 2)
        .order_by(func.avg(ReportedSalary.salary).desc())
        .limit(limit)
    ).all()
    
    return [
        RoleStatsData(
            role=role,
            avg_salary=round(avg_salary, 2),
            total_reports=count
        )
        for role, avg_salary, count in role_stats
    ]

@router.get("/salary-distribution", response_model=List[SalaryDistributionData])
def get_salary_distribution(session: Session = Depends(get_session)):
    """Get salary distribution across different ranges"""
    
    ranges = [
        ("$0-$15", 0, 15),
        ("$15-$20", 15, 20),
        ("$20-$25", 20, 25),
        ("$25-$30", 25, 30),
        ("$30-$35", 30, 35),
        ("$35-$40", 35, 40),
        ("$40-$45", 40, 45),
        ("$45-$50", 45, 50),
        ("$50+", 50, 999)
    ]
    
    total_reports = session.exec(select(func.count()).select_from(ReportedSalary)).one()
    
    result = []
    for range_label, min_val, max_val in ranges:
        if max_val == 999:
            count = session.exec(
                select(func.count())
                .select_from(ReportedSalary)
                .where(ReportedSalary.salary >= min_val)
            ).one()
        else:
            count = session.exec(
                select(func.count())
                .select_from(ReportedSalary)
                .where(ReportedSalary.salary >= min_val)
                .where(ReportedSalary.salary < max_val)
            ).one()
        
        percentage = (count / total_reports * 100) if total_reports > 0 else 0
        
        result.append(SalaryDistributionData(
            salary_range=range_label,
            count=count,
            percentage=round(percentage, 1)
        ))
    
    return result

@router.get("/company-comparison")
def get_company_comparison(companies: str, session: Session = Depends(get_session)):
    """Compare multiple companies (comma-separated company names)"""
    
    company_list = [company.strip() for company in companies.split(",")]
    
    result = {}
    for company in company_list:
        company_data = session.exec(
            select(ReportedSalary)
            .where(ReportedSalary.company == company)
        ).all()
        
        if company_data:
            salaries = [record.salary for record in company_data]
            result[company] = {
                "avg_salary": round(statistics.mean(salaries), 2),
                "median_salary": round(statistics.median(salaries), 2),
                "min_salary": round(min(salaries), 2),
                "max_salary": round(max(salaries), 2),
                "total_reports": len(salaries),
                "salary_data": salaries
            }
    
    return result

@router.get("/yearly-growth", response_model=List[YearlyGrowthData])
def get_yearly_growth(session: Session = Depends(get_session)):
    """Get year-over-year growth in salary submissions"""
    
    yearly_counts = session.exec(
        select(
            ReportedSalary.year,
            func.count(ReportedSalary.id)
        )
        .group_by(ReportedSalary.year)
        .order_by(ReportedSalary.year)
    ).all()
    
    result = []
    prev_count = None
    
    for year, count in yearly_counts:
        if prev_count is not None:
            growth_rate = ((count - prev_count) / prev_count) * 100
        else:
            growth_rate = 0.0
            
        result.append(YearlyGrowthData(
            year=year,
            total_reports=count,
            growth_rate=round(growth_rate, 1)
        ))
        
        prev_count = count
    
    return result

@router.get("/salary-by-term", response_model=List[SalaryByTermData])
def get_salary_by_term(session: Session = Depends(get_session)):
    """Get average salary by work term"""
    
    term_data = session.exec(
        select(
            ReportedSalary.term,
            func.avg(ReportedSalary.salary),
            func.count(ReportedSalary.id)
        )
        .where(ReportedSalary.term.is_not(None))
        .group_by(ReportedSalary.term)
        .order_by(ReportedSalary.term)
    ).all()
    
    return [
        SalaryByTermData(
            term=term,
            avg_salary=round(avg_salary, 2),
            total_reports=count
        )
        for term, avg_salary, count in term_data
    ]

@router.get("/market-insights")
def get_market_insights(session: Session = Depends(get_session)):
    """Get comprehensive market insights and statistics"""
    
    total_reports = session.exec(select(func.count()).select_from(ReportedSalary)).one()
    
    all_salaries = session.exec(select(ReportedSalary.salary).order_by(ReportedSalary.salary)).all()
    
    if all_salaries:
        percentile_25 = statistics.quantiles(all_salaries, n=4)[0]
        percentile_75 = statistics.quantiles(all_salaries, n=4)[2]
        percentile_90 = statistics.quantiles(all_salaries, n=10)[8]
    else:
        percentile_25 = percentile_75 = percentile_90 = 0.0
    
    current_year = 2024
    recent_avg = session.exec(
        select(func.avg(ReportedSalary.salary))
        .where(ReportedSalary.year >= current_year - 1)
    ).one() or 0.0
    
    older_avg = session.exec(
        select(func.avg(ReportedSalary.salary))
        .where(ReportedSalary.year < current_year - 1)
    ).one() or 0.0
    
    most_common_role = session.exec(
        select(ReportedSalary.role, func.count(ReportedSalary.id))
        .group_by(ReportedSalary.role)
        .order_by(func.count(ReportedSalary.id).desc())
        .limit(1)
    ).first()
    
    top_location_by_count = session.exec(
        select(ReportedSalary.location, func.count(ReportedSalary.id))
        .where(ReportedSalary.location.is_not(None))
        .where(ReportedSalary.location != "")
        .group_by(ReportedSalary.location)
        .order_by(func.count(ReportedSalary.id).desc())
        .limit(1)
    ).first()
    
    return {
        "total_reports": total_reports,
        "salary_percentiles": {
            "25th": round(percentile_25, 2),
            "75th": round(percentile_75, 2),
            "90th": round(percentile_90, 2)
        },
        "recent_vs_older": {
            "recent_avg": round(recent_avg, 2),
            "older_avg": round(older_avg, 2),
            "improvement": round(((recent_avg - older_avg) / older_avg * 100), 1) if older_avg > 0 else 0.0
        },
        "most_common_role": {
            "role": most_common_role[0] if most_common_role else "N/A",
            "count": most_common_role[1] if most_common_role else 0
        },
        "top_location_by_opportunities": {
            "location": top_location_by_count[0] if top_location_by_count else "N/A",
            "count": top_location_by_count[1] if top_location_by_count else 0
        }
    }
