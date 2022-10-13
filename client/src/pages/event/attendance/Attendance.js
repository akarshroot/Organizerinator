import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
// import xlsx from "json-as-xlsx"
import {
  generateTable,
  generateHTMLTable,
  generateExcel,
  parseDataToSchema
} from 'json5-to-table'
import parse from 'html-react-parser'
import './Attendance.css'


function Attendance() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendance] = useState({})
  const [error, setError] = useState("")
  const [sheetData, setSheetData] = useState("")
  const [sheetSchema, setSheetSchema] = useState([
    {title: "Team Members", path: "teamMembers", props: []}
  ])

  const { getAttendanceData } = useAuth()


  const exportToCSV = () => {
    // let settings = {
    //   fileName: "attendance_sheet", // Name of the resulting spreadsheet
    //   extraLength: 3, // A bigger number means that columns will be wider
    //   writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    //   writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    //   RTL: true, // Display the columns from right-to-left (the default value is false)
    // }
    // xlsx(attendanceData, settings) // Will download the excel file
    let schema = [
      { title: "Team Name", path: "teamName" },
      { title: "Team Size", path: "teamSize" },
      { title: "Team UID", path: "_id" },
      {
        title: "Team Members", path: "teamMembers", props: [
          { title: "Member Name", path: "name" },
          { title: "Member University Id", path: "universityId" },
          { title: "Member T-shirt Size", path: "tshirtSize" },
          { title: "Member Email", path: "email" },
          { title: "Member Department", path: "department" },
          { title: "UID", path: "_id" },
        ]
      }
    ]

    const data = generateHTMLTable(attendanceData, schema)
    generateExcel(attendanceData, schema, { writeTo: "attendance_sheet.xlsx" })
    setSheetData(data)

  }

  function handleSchemaOptions(e) {
    let name = e.target.getAttribute('data-title')
    let nested = e.target.getAttribute('data-nested')
    let id = e.target.id
    let value
    if (e.target.type == "checkbox")
      value = e.target.checked
    else value = e.target.value

    // if (nested == false) {
    //   setSheetSchema(lastValue => {
    //     return [
    //       ...lastValue,
    //       {
    //         title: name,
    //         path: id
    //       }
    //     ]
    //   })
    // }
    // else {
    //   setSheetSchema(lastValue => {
    //     let teamMemberPrev = lastValue.find(data => {console.log(data.path); return data.path == "teamMembers"})
    //     teamMemberPrev.props.push(
    //       {
    //         title: name,
    //         path: id
    //       }
    //     )
    //     return [
    //       ...lastValue,
    //       {title: "Team Members", path: "teamMembers", props: teamMemberPrev.props}
    //     ]
    //   })
    // }
  }

  async function fetchAttendance() {
    setLoading(true)
    try {
      const data = await getAttendanceData(params.eventId)
      setAttendance(data)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAttendance()
    return () => {
      setLoading(true)
      setAttendance({})
    }
  }, [])


  return (
    <div className='page-container'>
      <div className="column-selector">
        <p>Please select the columns you need in the generated sheet.</p>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" data-title="Team Name" id='teamName' /><label htmlFor='teamName'>Team Name</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" data-title="Team Size" id='teamSize' /><label htmlFor='teamSize'>Team Size</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="Name" id='name' /><label htmlFor='name'>Name</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="University Id" id='universityId' /><label htmlFor='universityId'>University Id</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="T-shirt Size" id='tshirtSize' /><label htmlFor='tshirtSize'>T-Shirt Size</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="Phone Number" id='phnNum' /><label htmlFor='phnNum'>Phone Number</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="Email" id='email' /><label htmlFor='email'>Email</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="Batch" id='batch' /><label htmlFor='batch'>Batch</label>
        </div>
        <div className='input-group'>
          <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" data-title="Department" id='department' /><label htmlFor='department'>Department</label>
        </div>
      </div>
      <button onClick={exportToCSV} disabled={loading}>{loading ? <h1>Loading...</h1> : <h1>Download Attendance Sheet</h1>}</button>
      <div className="table-container">
        {
          sheetData ? <>{parse(sheetData)}</> : <></>
        }
      </div>
    </div>
  )
}

export default Attendance