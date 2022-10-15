import React, { useEffect, useRef, useState } from 'react'
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
import './SheetGenerator.css'


function SheetGenerator() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendance] = useState({})
  const [error, setError] = useState("")
  const [sheetData, setSheetData] = useState("")
  const [sheetSchema, setSheetSchema] = useState({})
  const [schemaFlags, setSchemaFlags] = useState(
    {
      teamName: false,
      teamSize: false,
      teamNumber: false,
      teamId: false,
      teamMembers: false,

      name: false,
      universityId: false,
      tshirtSize: false,
      phnNum: false,
      email: false,
      batch: false,
      department: false,
      memberId: false,

      attendingStatus: false,
      eventId: false,
      registrationDate: false,
      signature: false,
      remarks: false,
      attendance: false
    }
  )

  const { getAttendanceData } = useAuth()

  const buttonRef = useRef()
  const resultRef = useRef()
  
  useEffect(() => {
    fetchAttendance()
    return () => {
      setLoading(true)
      setAttendance({})
    }
  }, [])

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

  function handleSchemaOptions(e) {
    let id = e.target.id
    let value = e.target.checked

    setSchemaFlags(lastValue => {
      return {
        ...lastValue,
        [id]: value
      }
    })
  }

  function exportToCSV() {
    let schema = [
      schemaFlags.attendingStatus ? { title: "Attending", path: "attending" } : null,
      schemaFlags.registrationDate ? { title: "Registration Date", path: "createdAt" } : null,
      schemaFlags.eventId ? { title: "Event Id", path: "eventId" } : null,
      schemaFlags.teamName ? { title: "Team Name", path: "teamName" } : null,
      schemaFlags.teamNumber ? { title: "Team Number", path: "teamNumber" } : null,
      schemaFlags.teamSize ? { title: "Team Size", path: "teamSize" } : null,
      schemaFlags.teamId ? { title: "Team UID", path: "_id" } : null,
      schemaFlags.teamMembers ? {
        title: "Team Members", path: "teamMembers", props: [
          schemaFlags.teamMembers && schemaFlags.name ? { title: "Member Name", path: "name" } : null,
          schemaFlags.teamMembers && schemaFlags.universityId ? { title: "Member University Id", path: "universityId" } : null,
          schemaFlags.teamMembers && schemaFlags.tshirtSize ? { title: "Member T-shirt Size", path: "tshirtSize" } : null,
          schemaFlags.teamMembers && schemaFlags.email ? { title: "Member Email", path: "email" } : null,
          schemaFlags.teamMembers && schemaFlags.batch ? { title: "Member Batch", path: "batch" } : null,
          schemaFlags.teamMembers && schemaFlags.department ? { title: "Member Department", path: "department" } : null,
          schemaFlags.teamMembers && schemaFlags.memberId ? { title: "UID", path: "_id" } : null,
          schemaFlags.teamMembers && schemaFlags.signature ? { title: "Signature", path: "signature" } : null,
          schemaFlags.teamMembers && schemaFlags.remarks ? { title: "Remarks", path: "remarks" } : null,
          schemaFlags.teamMembers && schemaFlags.attendance ? { title: "Attendance", path: "attendance" } : null,
        ].filter(x => x != null)
      } : null,
    ].filter(x => x !== null)

    console.log(schema)

    if (schema.length < 1 || (schema.find(data => data.path === "teamMembers") && schema.find(data => data.path === "teamMembers")?.props.length < 1)) return alert("Please select atleast one more column")
    setSheetSchema(schema)
    const data = generateHTMLTable(attendanceData, schema)
    generateExcel(attendanceData, schema, { writeTo: "sheet.xlsx" })
    setSheetData(data)
    buttonRef.current.scrollIntoView({ behaviour: "smooth" })
  }

  function printSheet() {
    const printWindow = window.open("", "", resultRef.current.offsetWidth, resultRef.current.offsetHeight)
    let content = `
      <head>
        <style>
          td, th {
            border: 1px solid black;
            padding: 5px;
          }  
        </style>
      </head>
      <body>
      ${sheetData}
      </body>
    `
    printWindow.document.write(content)
    printWindow.print()
  }

  return (
    <div className='page-container'>
      <p className='instructions'>Please select the columns you need in the generated sheet.</p>
      <div className="column-selector">
        <div className="col1-attendance">
          <h3>Team Info</h3>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" checked={schemaFlags.teamName} data-title="Team Name" id='teamName' /><label htmlFor='teamName'>Team Name</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" checked={schemaFlags.teamSize} data-title="Team Size" id='teamSize' /><label htmlFor='teamSize'>Team Size</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.teamNumber} data-title="Team Number" id='teamNumber' /><label htmlFor='department'>Team Number</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" checked={schemaFlags.teamId} data-title="Team Id" id='teamId' /><label htmlFor='teamId'>Team Id</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.attendingStatus} data-title="Attending Status" id='attendingStatus' /><label htmlFor='email'>Attending Status</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.eventId} data-title="Event Id" id='eventId' /><label htmlFor='department'>Event Id</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.registrationDate} data-title="Registration Date" id='registrationDate' /><label htmlFor='department'>Registration Date</label>
          </div>
        </div>

        <div className="col2-attendance">
          <h3>Member Info</h3>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="false" checked={schemaFlags.teamMembers} data-title="Team Members" id='teamMembers' /><label htmlFor='teamMembers'>Team Members</label>
          </div>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.name} data-title="Name" id='name' /><label htmlFor='name'>Name</label>
          </div>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.universityId} data-title="University Id" id='universityId' /><label htmlFor='universityId'>University Id</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.tshirtSize} data-title="T-shirt Size" id='tshirtSize' /><label htmlFor='tshirtSize'>T-Shirt Size</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.phnNum} data-title="Phone Number" id='phnNum' /><label htmlFor='phnNum'>Phone Number</label>
          </div>

          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.email} data-title="Email" id='email' /><label htmlFor='email'>Email</label>
          </div>
        </div>

        <div className="col3-attendance">
          <h3>Academic Info</h3>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.batch} data-title="Batch" id='batch' /><label htmlFor='batch'>Batch</label>
          </div>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.department} data-title="Department" id='department' /><label htmlFor='department'>Department</label>
          </div>

          <h3>Blank Fields</h3>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' disabled={!schemaFlags.teamMembers} data-nested="true" checked={schemaFlags.signature} data-title="Signature" id='signature' /><label htmlFor='signature'>Signature</label>
          </div>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.remarks} data-title="Remarks" id='remarks' /><label htmlFor='remarks'>Remarks</label>
          </div>
          <div className='input-group-checkbox'>
            <input onChange={handleSchemaOptions} type='checkbox' data-nested="true" checked={schemaFlags.attendance} data-title="Attendance" id='attendance' /><label htmlFor='attendance'>Attendance</label>
          </div>
        </div>
      </div>
      <button ref={buttonRef} className='download-btn button-48' onClick={exportToCSV} disabled={loading}><span>{loading ? <>Loading...</> : <>Generate Sheet & Download</>}</span></button>
      {sheetData ?
        <>
          <button className='download-btn button-48' onClick={printSheet} disabled={loading}><span>Print</span></button>
          <div className="table-container" id="result" ref={resultRef}>
            <>{parse(sheetData)}</>
          </div>
        </>
        : <></>
      }
    </div>
  )
}

export default SheetGenerator