import { Injectable } from '@angular/core';
import { DepartmentApiModel } from '../models/department-api-model';
import { DailyWageModel } from '../models/daily-wage-model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private departments: DepartmentApiModel[] = [
    {
      totalDay: 6,
      name: 'Concepción',
      id: 1,
      capitalDistrict: 'Concepción'
    },
    {
      name: 'San Pedro',
      totalDay: 5,
      id: 2,
      capitalDistrict: 'San Pedro del Ycuamandiyu'
    },
    {
      totalDay: 6,
      name: 'Cordillera',
      id: 3,
      capitalDistrict: 'Caacupe'
    },
    {
      totalDay: 6,
      name: 'Guaira',
      id: 4,
      capitalDistrict: 'Villarica'
    },
    {
      totalDay: 5,
      name: 'Caaguazú',
      id: 5,
      capitalDistrict: 'Coronel Oviedo'
    },
    {
      name: 'Caazapá',
      totalDay: 5,
      id: 6,
      capitalDistrict: 'Caazapá'
    },
    {
      name: 'Itapúa',
      totalDay: 7.5,
      id: 7,
      capitalDistrict: 'Encarnación'
    },
    {
      totalDay: 5,
      name: 'Misiones',
      id: 8,
      capitalDistrict: 'San Juan Bautista'
    },
    {
      totalDay: 4.5,
      name: 'Paraguarí',
      id: 9,
      capitalDistrict: 'Paraguarí'
    },
    {
      totalDay: 7.5,
      name: 'Alto Paraná',
      id: 10,
      capitalDistrict: 'Ciudad del Este'
    },
    {
      totalDay: 7.5,
      name: 'Central',
      id: 11,
      capitalDistrict: 'Aregua'
    },
    {
      totalDay: 5.5,
      name: 'Ñeembucú',
      id: 12,
      capitalDistrict: 'Pilar'
    },
    {
      name: 'Amambay',
      totalDay: 6,
      id: 13,
      capitalDistrict: 'Pedro Juan Caballero'
    },
    {
      totalDay: 6,
      name: 'Canindeyú',
      id: 14,
      capitalDistrict: 'Salto del Guaira'
    },
    {
      name: 'Pte. Hayes',
      totalDay: 5,
      id: 15,
      capitalDistrict: 'Villa Hayes'
    },
    {
      name: 'Alto Paraguay',
      totalDay: 5,
      id: 16,
      capitalDistrict: 'Fuerte Olimpo'
    },
    {
      name: 'Boquerón',
      totalDay: 7,
      id: 17,
      capitalDistrict: 'Filadelfia'
    }
  ]

  private dailyWage: DailyWageModel = {
    id: '1',
    amount: 98089,
    total100: 1,
    total40: 0.4,
    total60: 0.6,
    total80: 0.8
  }

  constructor() { }

  public getDepartment = () => this.departments.sort((a, b) => a.id - b.id)

  public getDailyWage = (): DailyWageModel => this.dailyWage

}
