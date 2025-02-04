'use client'
import { useParams } from 'next/navigation'
 
export default function Company() {
  const params = useParams();
  const { companyName } = params;


  return (
  <p>Post: {companyName}</p>
)

}