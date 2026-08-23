import {
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";

import axios from "axios";
import Select from "react-select";
import Sidebar from "../../components/Sidebar";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEdit
} from "react-icons/fa";

import "../../styles/myleads.css";

/* =========================================================
   API
========================================================= */

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";


export default function MyLeads() {

  /* =========================================================
     SIDEBAR
  ========================================================= */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  /* =========================================================
     LEADS
  ========================================================= */

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);


  /* =========================================================
     SEARCH
  ========================================================= */

  const [search, setSearch] = useState("");


  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const [statusFilter, setStatusFilter] = useState([]);


  /* =========================================================
     SELECTED LEAD
  ========================================================= */

  const [selectedLead, setSelectedLead] = useState(null);


  /* =========================================================
     EDIT MODAL
  ========================================================= */

  const [showModal, setShowModal] = useState(false);


  /* =========================================================
     BOOKING MODAL
  ========================================================= */

  const [showBookingModal, setShowBookingModal] = useState(false);


  const [bookingData, setBookingData] = useState({
    unitNo: "",
    bookingAmount: ""
  });


  /* =========================================================
     ADVANCED SEARCH
  ========================================================= */

  const [showAdvancedSearch, setShowAdvancedSearch] =
    useState(false);


  const [subSourceFilter, setSubSourceFilter] =
    useState("");

  const [assignedFilter, setAssignedFilter] =
    useState("");

  const [fromDateFilter, setFromDateFilter] =
    useState("");

  const [toDateFilter, setToDateFilter] =
    useState("");

  const [nextCallFrom, setNextCallFrom] =
    useState("");

  const [nextCallTo, setNextCallTo] =
    useState("");

  const [descriptionFilter, setDescriptionFilter] =
    useState("");


  /* =========================================================
     MULTI SELECT FILTERS
  ========================================================= */

  const [selectedProjects, setSelectedProjects] =
    useState(null);

  const [selectedSources, setSelectedSources] =
    useState([]);

  const [selectedDepartments, setSelectedDepartments] =
    useState([]);

  const [selectedExecutives, setSelectedExecutives] =
    useState([]);

  const [selectedCities, setSelectedCities] =
    useState([]);


  /* =========================================================
     CALL
  ========================================================= */

  const [callModal, setCallModal] =
    useState(false);

  const [activeCall, setActiveCall] =
    useState(null);

  const [callStartTime, setCallStartTime] =
    useState(null);

  const [callDuration, setCallDuration] =
    useState("");


  /* =========================================================
     PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const leadsPerPage = 10;


  /* =========================================================
     NEW LEAD MODAL
  ========================================================= */

  const [showNewLeadModal, setShowNewLeadModal] =
    useState(false);


  /* =========================================================
     NEW LEAD DATA
  ========================================================= */

  const [newLead, setNewLead] = useState({

    name: "",

    phone: "",

    email: "",

    executive_email: "",

    project: "",

    status: "New",

    source: "",

    subSource: "",

    city: "",

    assignedTo: "",

    assigned_to_email: "",

    closingExecutive: "",

    next_call_date: "",

    department: "",

    description: "",

    deadReason: "",

    deadSubReason: "",

    bookingDate: ""

  });


  /* =========================================================
     DROPDOWN OPTIONS
  ========================================================= */

  const projectOptions = [

    "99villa.",

    "99 villa plot.",

    "Affordable life",

    "Alibaug Plot.",

    "ANJALI ZAMIN.",

    "Gudipadwa plot in 5 Lacs.",

    "Khopoli-pali Road plots",

    "Maha-Mumbaai",

    "Mahamumbai",

    "MAHAMUMBAI",

    "Maha-Mumbaii",

    "Mahamumbai Phase 2",

    "Mmahamumbai.",

    "Panvel (99Villa)",

    "Sheetal Campaign.",

    "Sheetal THANE.",

    "Thane (Nitesh)",

    "Thane (Virendra)",

    "THANE...( VIRENDRA)",

    "THANE...( VIRENDRAA)"

  ];


  /* =========================================================
     STATUS OPTIONS
  ========================================================= */

  const statusOptions = [

    "New",

    "Ringing",

    "Connected",

    "Interested",

    "Old Booking From Old Data",

    "Old Site Visit",

    "Very Interested",

    "Out of Service",

    "Not Interested",

    "Call Cut",

    "Busy",

    "Call Back",

    "Switched Off",

    "Number Not Reachable",

    "Wrong Number",

    "Invalid Number",

    "Duplicate Lead",

    "Follow Up",

    "Follow Up Done",

    "Meeting Scheduled",

    "Site Visit Planned",

    "Site Visit Done",

    "Negotiation",

    "Payment Pending",

    "Booked",

    "Already Booked But 7/12 Pending",

    "Documents Pending",

    "Other Property Booked",

    "Token Received",

    "Cancelled",

    "Future Prospect",

    "No Response"

  ];


  /* =========================================================
     DEAD REASON
  ========================================================= */

  const deadReasonOptions = [

    "Budget Issue",

    "Location Issue",

    "Other"

  ];


  /* =========================================================
     SOURCE OPTIONS
  ========================================================= */

  const sourceOptions = [

    "Website",

    "99 Acres",

    "Facebook",

    "Google",

    "Hoarding",

    "Microsites",

    "Virtual call",

    "Vishal Sir Leads",

    "Chatbot",

    "Reference",

    "Old client"

  ];


  /* =========================================================
     DEPARTMENT OPTIONS
  ========================================================= */

  const departmentOptions = [

    "Sales/Marketing",

    "HR/Admin",

    "Aasma Madam",

    "Nilesh Sir",

    "Telecaller"

  ];


  /* =========================================================
     REACT SELECT OPTIONS
  ========================================================= */

  const sourceDropdownOptions =
    sourceOptions.map((item) => ({

      value: item,

      label: item

    }));


  const departmentDropdownOptions =
    departmentOptions.map((item) => ({

      value: item,

      label: item

    }));


  /* =========================================================
     USER
  ========================================================= */

  const user = useMemo(() => {

    try {

      return (
        JSON.parse(
          localStorage.getItem("user")
        ) || {}
      );

    } catch (error) {

      console.error(
        "User data error:",
        error
      );

      return {};

    }

  }, []);


  /* =========================================================
     EXECUTIVE DROPDOWN
  ========================================================= */

  const executiveDropdownOptions =
    useMemo(() => {

      const executives = [
        ...new Set(

          leads

            .map(
              (lead) =>
                lead.closingExecutive
            )

            .filter(Boolean)

        )
      ];

      return executives.map((item) => ({

        value: item,

        label: item

      }));

    }, [leads]);


  /* =========================================================
     CITY DROPDOWN
  ========================================================= */

  const cityDropdownOptions =
    useMemo(() => {

      const cities = [
        ...new Set(

          leads

            .map(
              (lead) =>
                lead.city
            )

            .filter(Boolean)

        )
      ];

      return cities.map((item) => ({

        value: item,

        label: item

      }));

    }, [leads]);


  /* =========================================================
     FETCH MY LEADS
  ========================================================= */

  const fetchMyLeads = useCallback(
    async () => {

      try {

        setLoading(true);


        if (!user?.email) {

          console.error(
            "User email not found"
          );

          setLeads([]);

          setLoading(false);

          return;

        }


        const response =
          await axios.get(

            `${API}/my-leads`,

            {

              params: {

                email:
                  user.email

              }

            }

          );


        console.log(
          "MY LEADS RESPONSE:",
          response.data
        );


        setLeads(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );


      } catch (error) {

        console.error(
          "Error fetching My Leads:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );

        setLeads([]);

      } finally {

        setLoading(false);

      }

    },

    [user]

  );


  /* =========================================================
     LOAD LEADS
  ========================================================= */

  useEffect(() => {

    fetchMyLeads();

  }, [fetchMyLeads]);


  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus =
    async (
      leadId,
      status
    ) => {

      try {

        const currentUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          ) || {};


        if (!leadId) {

          alert(
            "Lead ID missing ❌"
          );

          return;

        }


        if (!status) {

          alert(
            "Please select status ❌"
          );

          return;

        }


        console.log(
          "Updating Status:",
          {

            leadId,

            status,

            executive_email:
              currentUser.email

          }
        );


        await axios.put(

          `${API}/update-status/${leadId}`,

          {

            status: status,

            executive_email:
              currentUser.email

          }

        );


        /* =========================================
           UPDATE UI
        ========================================= */

        setLeads(
          (previousLeads) =>

            previousLeads.map(
              (lead) =>

                lead._id === leadId

                  ? {

                      ...lead,

                      status:
                        status,

                      updatedAt:
                        new Date()
                          .toISOString()

                    }

                  : lead

            )

        );


        /* =========================================
           REFRESH MONGODB DATA
        ========================================= */

        await fetchMyLeads();


      } catch (error) {

        console.error(
          "Status update failed:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );


        alert(

          error.response?.data
            ?.message ||

          error.response?.data
            ?.error ||

          "Status update failed ❌"

        );

      }

    };


  /* =========================================================
     UPDATE LEAD
  ========================================================= */

  const handleUpdateLead =
    async () => {

      try {

        if (!selectedLead?._id) {

          alert(
            "Lead ID missing ❌"
          );

          return;

        }


        const updatedData = {

          executive_email:

            selectedLead
              .executive_email ||

            user.email,


          name:
            selectedLead.name,


          phone:
            selectedLead.phone,


          email:
            selectedLead.email,


          assignedTo:
            selectedLead.assignedTo,


          assigned_to_email:

            selectedLead
              .assigned_to_email,


          assigned_to:

            selectedLead
              .assigned_to_email,


          closingExecutive:

            selectedLead
              .closingExecutive,


          status:
            selectedLead.status,


          source:
            selectedLead.source,


          subSource:
            selectedLead.subSource,


          city:
            selectedLead.city,


          project:
            selectedLead.project,


          next_call_date:

            selectedLead
              .next_call_date,


          description:

            selectedLead
              .description,


          department:

            selectedLead
              .department,


          deadReason:

            selectedLead
              .deadReason,


          deadSubReason:

            selectedLead
              .deadSubReason,


          bookingDate:

            selectedLead
              .bookingDate

        };


        console.log(
          "Updating Lead:",
          updatedData
        );


        await axios.put(

          `${API}/update-lead/${selectedLead._id}`,

          updatedData

        );


        /* =========================================
           UPDATE LOCAL STATE
        ========================================= */

        setLeads(
          (previousLeads) =>

            previousLeads.map(
              (lead) =>

                lead._id ===
                selectedLead._id

                  ? {

                      ...lead,

                      ...selectedLead

                    }

                  : lead

            )

        );


        setShowModal(false);


        /* =========================================
           REFRESH FROM DATABASE
        ========================================= */

        await fetchMyLeads();


        alert(
          "Lead Updated ✅"
        );


      } catch (error) {

        console.error(
          "Update lead failed:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );


        alert(
          error.response?.data
            ?.message ||

          "Update Failed ❌"
        );

      }

    };


  /* =========================================================
     START CALL
  ========================================================= */

  const startCall =
    async (lead) => {

      try {

        setActiveCall(lead);

        setCallStartTime(
          new Date()
        );

        setCallDuration(
          "0 sec"
        );


        if (lead?.phone) {

          window.open(
            `tel:${lead.phone}`,
            "_self"
          );

        }


        setTimeout(() => {

          setCallModal(true);

        }, 3000);


      } catch (error) {

        console.error(
          "Call error:",
          error
        );

      }

    };


  /* =========================================================
     CALL TIMER
  ========================================================= */

  useEffect(() => {

    let interval;


    if (
      callModal &&
      callStartTime
    ) {

      interval =
        setInterval(() => {

          const seconds =
            Math.floor(

              (
                new Date() -
                callStartTime

              ) / 1000

            );


          setCallDuration(
            `${seconds} sec`
          );


        }, 1000);

    }


    return () => {

      if (interval) {

        clearInterval(
          interval
        );

      }

    };

  }, [
    callModal,
    callStartTime
  ]);


  /* =========================================================
     CREATE BOOKING
  ========================================================= */

  const handleCreateBooking =
    async () => {

      try {

        if (!selectedLead?._id) {

          alert(
            "Lead not selected ❌"
          );

          return;

        }


        await axios.post(

          `${API}/create-booking`,

          {

            leadId:
              selectedLead._id,


            clientName:
              selectedLead.name,


            phone:
              selectedLead.phone,


            project:
              selectedLead.project,


            executive:
              selectedLead
                .closingExecutive,


            attendingOfficer:
              selectedLead
                .assignedTo,


            unitNo:
              bookingData.unitNo,


            bookingAmount:
              bookingData
                .bookingAmount

          }

        );


        alert(
          "Booking Added ✅"
        );


        setShowBookingModal(
          false
        );


        setBookingData({

          unitNo: "",

          bookingAmount: ""

        });


        await fetchMyLeads();


      } catch (error) {

        console.error(
          "Booking failed:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );


        alert(
          error.response?.data
            ?.message ||

          "Booking Failed ❌"
        );

      }

    };
      /* =========================================================
     ADD NEW LEAD
  ========================================================= */

  const handleAddNewLead =
    async () => {

      /* =========================================
         REQUIRED FIELDS
      ========================================= */

      if (
        !newLead.name ||
        !newLead.phone ||
        !newLead.project
      ) {

        alert(
          "Please fill required fields ❌"
        );

        return;

      }


      try {

        console.log(
          "Adding New Lead:",
          newLead
        );


        /* =========================================
           SEND TO MONGODB
        ========================================= */

        const response =
          await axios.post(

            `${API}/add-lead`,

            {

              ...newLead,

              executive_email:
                newLead.executive_email ||
                user.email,

              assigned_to_email:
                newLead.assigned_to_email ||
                user.email

            }

          );


        console.log(
          "New Lead Response:",
          response.data
        );


        /* =========================================
           GET CREATED LEAD
        ========================================= */

        const createdLead =
          response.data?.lead ||
          response.data;


        /* =========================================
           ADD DIRECTLY TO TABLE
        ========================================= */

        if (createdLead) {

          setLeads(
            (previousLeads) => [

              createdLead,

              ...previousLeads

            ]
          );

        }


        /* =========================================
           SUCCESS
        ========================================= */

        alert(
          "Lead Added Successfully ✅"
        );


        setShowNewLeadModal(
          false
        );


        /* =========================================
           RESET FORM
        ========================================= */

        setNewLead({

          name: "",

          phone: "",

          email: "",

          executive_email: "",

          project: "",

          status: "New",

          source: "",

          subSource: "",

          city: "",

          assignedTo:
            user?.name ||
            user?.username ||
            "",

          assigned_to_email:
            user?.email ||
            "",

          closingExecutive:
            user?.name ||
            user?.username ||
            "",

          next_call_date: "",

          department: "",

          description: "",

          deadReason: "",

          deadSubReason: "",

          bookingDate: ""

        });


        /* =========================================
           REFRESH DATABASE DATA
        ========================================= */

        await fetchMyLeads();


      } catch (error) {

        console.error(
          "Add New Lead Failed:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );


        alert(

          error.response?.data
            ?.message ||

          error.response?.data
            ?.error ||

          "Failed To Add Lead ❌"

        );

      }

    };


  /* =========================================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================================= */

  useEffect(() => {

    setCurrentPage(1);

  }, [

    search,

    statusFilter,

    selectedProjects,

    selectedSources,

    selectedExecutives,

    selectedCities,

    selectedDepartments,

    subSourceFilter,

    assignedFilter,

    fromDateFilter,

    toDateFilter,

    nextCallFrom,

    nextCallTo,

    descriptionFilter

  ]);


  /* =========================================================
     FILTERED LEADS
  ========================================================= */

  const filteredLeads =
    useMemo(() => {

      return leads.filter(
        (lead) => {


          /* =========================================
             GLOBAL SEARCH
          ========================================= */

          const searchText = `

            ${lead.name || ""}

            ${lead.phone || ""}

            ${lead.project || ""}

            ${lead.source || ""}

            ${lead.closingExecutive || ""}

            ${lead.description || ""}

            ${lead.assignedTo || ""}

            ${lead.subSource || ""}

          `;


          const matchesSearch =
            searchText
              .toLowerCase()
              .includes(
                search
                  .toLowerCase()
                  .trim()
              );


          /* =========================================
             STATUS
          ========================================= */

          const matchesStatus =

            statusFilter.length > 0

              ? statusFilter.some(
                  (status) => {

                    /*
                     * Clicking Interested card
                     * should show both:
                     * Interested
                     * Very Interested
                     */

                    if (
                      status.value ===
                      "Interested"
                    ) {

                      return (

                        lead.status ===
                        "Interested" ||

                        lead.status ===
                        "Very Interested"

                      );

                    }


                    return (

                      lead.status ===
                      status.value

                    );

                  }
                )

              : true;


          /* =========================================
             PROJECT
          ========================================= */

          const matchesProject =

            selectedProjects

              ? (

                  lead.project ===
                  selectedProjects.value

                )

              : true;


          /* =========================================
             SOURCE
          ========================================= */

          const matchesSource =

            selectedSources.length > 0

              ? selectedSources.some(
                  (source) =>

                    source.value ===
                    lead.source

                )

              : true;


          /* =========================================
             EXECUTIVE
          ========================================= */

          const matchesExecutive =

            selectedExecutives.length > 0

              ? selectedExecutives.some(
                  (executive) =>

                    executive.value ===
                    lead.closingExecutive

                )

              : true;


          /* =========================================
             CITY
          ========================================= */

          const matchesCity =

            selectedCities.length > 0

              ? selectedCities.some(
                  (city) =>

                    city.value ===
                    lead.city

                )

              : true;


          /* =========================================
             DEPARTMENT
          ========================================= */

          const matchesDepartment =

            selectedDepartments.length > 0

              ? selectedDepartments.some(
                  (department) =>

                    department.value ===
                    lead.department

                )

              : true;


          /* =========================================
             ASSIGNED TO
          ========================================= */

          const assignedValue =

            String(
              lead.assignedTo ||
              lead.assigned_to_email ||
              ""
            );


          const matchesAssigned =

            assignedFilter

              ? assignedValue
                  .toLowerCase()
                  .includes(
                    assignedFilter
                      .toLowerCase()
                  )

              : true;


          /* =========================================
             DESCRIPTION
          ========================================= */

          const descriptionValue =

            String(
              lead.description ||
              ""
            );


          const matchesDescription =

            descriptionFilter

              ? descriptionValue
                  .toLowerCase()
                  .includes(
                    descriptionFilter
                      .toLowerCase()
                  )

              : true;


          /* =========================================
             CREATED DATE
          ========================================= */

          const createdDate =

            lead.createdAt

              ? new Date(
                  lead.createdAt
                )
                  .toISOString()
                  .split("T")[0]

              : "";


          const matchesFromDate =

            fromDateFilter

              ? createdDate >=
                fromDateFilter

              : true;


          const matchesToDate =

            toDateFilter

              ? createdDate <=
                toDateFilter

              : true;


          /* =========================================
             SUB SOURCE
          ========================================= */

          const subSourceValue =

            String(
              lead.subSource ||
              ""
            );


          const matchesSubSource =

            subSourceFilter

              ? subSourceValue
                  .toLowerCase()
                  .includes(
                    subSourceFilter
                      .toLowerCase()
                  )

              : true;


          /* =========================================
             NEXT CALL DATE
          ========================================= */

          let nextCallDate = "";


          if (
            lead.next_call_date
          ) {

            nextCallDate =

              String(
                lead.next_call_date
              )
                .split("T")[0];

          }


          const matchesNextCallFrom =

            nextCallFrom

              ? nextCallDate >=
                nextCallFrom

              : true;


          const matchesNextCallTo =

            nextCallTo

              ? nextCallDate <=
                nextCallTo

              : true;


          /* =========================================
             FINAL FILTER RESULT
          ========================================= */

          return (

            matchesSearch &&

            matchesStatus &&

            matchesProject &&

            matchesSource &&

            matchesExecutive &&

            matchesCity &&

            matchesDepartment &&

            matchesAssigned &&

            matchesDescription &&

            matchesFromDate &&

            matchesToDate &&

            matchesSubSource &&

            matchesNextCallFrom &&

            matchesNextCallTo

          );

        }

      );

    }, [

      leads,

      search,

      statusFilter,

      selectedProjects,

      selectedSources,

      selectedExecutives,

      selectedCities,

      selectedDepartments,

      assignedFilter,

      descriptionFilter,

      fromDateFilter,

      toDateFilter,

      subSourceFilter,

      nextCallFrom,

      nextCallTo

    ]);


  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =

    Math.ceil(
      filteredLeads.length /
      leadsPerPage
    );


  const indexOfLastLead =

    currentPage *
    leadsPerPage;


  const indexOfFirstLead =

    indexOfLastLead -
    leadsPerPage;


  const currentLeads =

    filteredLeads.slice(

      indexOfFirstLead,

      indexOfLastLead

    );


  /* =========================================================
     NEXT PAGE
  ========================================================= */

  const handleNextPage =
    () => {

      if (
        currentPage <
        totalPages
      ) {

        setCurrentPage(
          currentPage + 1
        );

      }

    };


  /* =========================================================
     PREVIOUS PAGE
  ========================================================= */

  const handlePrevPage =
    () => {

      if (
        currentPage > 1
      ) {

        setCurrentPage(
          currentPage - 1
        );

      }

    };


  /* =========================================================
     FILTERED STATS
  ========================================================= */

  const stats =
    useMemo(() => {

      return {

        total:
          filteredLeads.length,


        new:
          filteredLeads.filter(
            (lead) =>
              lead.status ===
              "New"
          ).length,


        interested:
          filteredLeads.filter(
            (lead) =>

              lead.status ===
              "Interested" ||

              lead.status ===
              "Very Interested"

          ).length,


        booked:
          filteredLeads.filter(
            (lead) =>
              lead.status ===
              "Booked"
          ).length,


        followup:
          filteredLeads.filter(
            (lead) =>
              lead.status ===
              "Follow Up"
          ).length,


        notInterested:
          filteredLeads.filter(
            (lead) =>
              lead.status ===
              "Not Interested"
          ).length,


        siteVisitDone:
          filteredLeads.filter(
            (lead) =>
              lead.status ===
              "Site Visit Done"
          ).length

      };

    }, [
      filteredLeads
    ]);


  /* =========================================================
     STATUS CARD CLICK
  ========================================================= */

  const handleCardClick =
    (status) => {

      /* =========================================
         TOTAL
      ========================================= */

      if (
        status ===
        "TOTAL"
      ) {

        setStatusFilter([]);

      }

      /* =========================================
         SPECIFIC STATUS
      ========================================= */

      else {

        setStatusFilter([

          {

            value:
              status,

            label:
              status

          }

        ]);

      }


      setCurrentPage(1);

    };


  /* =========================================================
     CLEAR ALL FILTERS
  ========================================================= */

  const clearAllFilters =
    () => {

      setSearch("");

      setSubSourceFilter("");

      setAssignedFilter("");

      setStatusFilter([]);

      setFromDateFilter("");

      setToDateFilter("");

      setNextCallFrom("");

      setNextCallTo("");

      setDescriptionFilter("");

      setSelectedProjects(null);

      setSelectedSources([]);

      setSelectedDepartments([]);

      setSelectedExecutives([]);

      setSelectedCities([]);

      setCurrentPage(1);

    };


  /* =========================================================
     OPEN EDIT MODAL
  ========================================================= */

  const openEditModal =
    (lead) => {

      setSelectedLead({

        ...lead,

        executive_email:

          lead.executive_email ||
          user.email ||
          "",


        assignedTo:

          lead.assignedTo ||
          "",


        assigned_to_email:

          lead.assigned_to_email ||
          user.email ||
          "",


        next_call_date:

          lead.next_call_date

            ? String(
                lead.next_call_date
              )
                .split("T")[0]

            : ""

      });


      setShowModal(true);

    };


  /* =========================================================
     OPEN BOOKING MODAL
  ========================================================= */

  const openBookingModal =
    (lead) => {

      setSelectedLead(
        lead
      );


      setBookingData({

        unitNo: "",

        bookingAmount: ""

      });


      setShowBookingModal(
        true
      );

    };


  /* =========================================================
     EXPORT CSV
  ========================================================= */

  const exportCSV =
    () => {

      const csvRows = [];


      /* =========================================
         HEADERS
      ========================================= */

      const headers = [

        "Name",

        "Mobile",

        "Assigned To",

        "Assigned Email",

        "Closing Executive",

        "Status",

        "Source",

        "Project",

        "Description",

        "Next Call Date",

        "Sub Source",

        "City",

        "Department",

        "Created At",

        "Last Activity"

      ];


      csvRows.push(
        headers.join(",")
      );


      /* =========================================
         DATA
      ========================================= */

      filteredLeads.forEach(
        (lead) => {

          const row = [

            `"${String(
              lead.name || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.phone || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.assignedTo || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.assigned_to_email ||
              ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.closingExecutive ||
              ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.status || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.source || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.project || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.description || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${lead.next_call_date
              ? String(
                  lead.next_call_date
                ).split("T")[0]
              : ""
            }"`,

            `"${String(
              lead.subSource || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.city || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.department || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.createdAt || ""
            ).replace(
              /"/g,
              '""'
            )}"`,

            `"${String(
              lead.updatedAt || ""
            ).replace(
              /"/g,
              '""'
            )}"`

          ];


          csvRows.push(
            row.join(",")
          );

        }
      );


      /* =========================================
         DOWNLOAD
      ========================================= */

      const blob =
        new Blob(

          [
            csvRows.join(
              "\n"
            )
          ],

          {
            type:
              "text/csv;charset=utf-8;"
          }

        );


      const url =
        window.URL.createObjectURL(
          blob
        );


      const anchor =
        document.createElement(
          "a"
        );


      anchor.href = url;

      anchor.download =
        "my-leads.csv";


      document.body.appendChild(
        anchor
      );


      anchor.click();


      document.body.removeChild(
        anchor
      );


      window.URL.revokeObjectURL(
        url
      );

    };
      return (

    <div className="layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className={`main-content ${
          isOpen
            ? "shifted"
            : "full"
        }`}
      >


        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="page-header">

          <div>

            <h2>
              My Leads
            </h2>

            <p>

              Total Leads :

              <strong>
                {" "}
                {leads.length}
              </strong>

            </p>

          </div>

        </div>


        {/* ===================================================
            STATS CARDS
        =================================================== */}

        <div className="stats-grid">


          {/* TOTAL */}

          <div
            className={`stats-card ${
              statusFilter.length === 0
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "TOTAL"
              )
            }
          >

            <h5>
              Total
            </h5>

            <p>
              {stats.total}
            </p>

          </div>


          {/* NEW */}

          <div
            className={`stats-card new ${
              statusFilter.some(
                (s) =>
                  s.value === "New"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "New"
              )
            }
          >

            <h5>
              New
            </h5>

            <p>
              {stats.new}
            </p>

          </div>


          {/* INTERESTED */}

          <div
            className={`stats-card interested ${
              statusFilter.some(
                (s) =>
                  s.value ===
                  "Interested"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "Interested"
              )
            }
          >

            <h5>
              Interested
            </h5>

            <p>
              {stats.interested}
            </p>

          </div>


          {/* BOOKED */}

          <div
            className={`stats-card booked ${
              statusFilter.some(
                (s) =>
                  s.value ===
                  "Booked"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "Booked"
              )
            }
          >

            <h5>
              Booked
            </h5>

            <p>
              {stats.booked}
            </p>

          </div>


          {/* FOLLOW UP */}

          <div
            className={`stats-card followup ${
              statusFilter.some(
                (s) =>
                  s.value ===
                  "Follow Up"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "Follow Up"
              )
            }
          >

            <h5>
              Followup
            </h5>

            <p>
              {stats.followup}
            </p>

          </div>


          {/* NOT INTERESTED */}

          <div
            className={`stats-card not ${
              statusFilter.some(
                (s) =>
                  s.value ===
                  "Not Interested"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "Not Interested"
              )
            }
          >

            <h5>
              Not Interested
            </h5>

            <p>
              {stats.notInterested}
            </p>

          </div>


          {/* SITE VISIT */}

          <div
            className={`stats-card sitevisit ${
              statusFilter.some(
                (s) =>
                  s.value ===
                  "Site Visit Done"
              )
                ? "active-card"
                : ""
            }`}
            onClick={() =>
              handleCardClick(
                "Site Visit Done"
              )
            }
          >

            <h5>
              Site Visit Done
            </h5>

            <p>
              {stats.siteVisitDone}
            </p>

          </div>

        </div>


        {/* ===================================================
            GLOBAL SEARCH
        =================================================== */}

        <div className="filter-bar">

          <input
            type="text"
            placeholder="Type to search"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="global-search"
          />

        </div>


        {/* ===================================================
            TOP ACTION BUTTONS
        =================================================== */}

        <div className="top-actions">


          {/* ADVANCED SEARCH */}

          <button
            className="advanced-btn"
            onClick={() =>
              setShowAdvancedSearch(
                !showAdvancedSearch
              )
            }
          >

            {showAdvancedSearch
              ? "Hide Advanced Search"
              : "Advanced Search"}

          </button>


          {/* NEW LEAD */}

          <button
            className="newlead-btn"
            onClick={() => {

              setNewLead(
                (previous) => ({

                  ...previous,

                  assignedTo:
                    user?.name ||
                    user?.username ||
                    "",

                  assigned_to_email:
                    user?.email ||
                    "",

                  executive_email:
                    user?.email ||
                    "",

                  closingExecutive:
                    user?.name ||
                    user?.username ||
                    "",

                  status:
                    previous.status ||
                    "New"

                })
              );


              setShowNewLeadModal(
                true
              );

            }}
          >

            + New Lead

          </button>


          {/* EXPORT */}

          <button
            className="export-btn"
            onClick={
              exportCSV
            }
          >

            Export CSV

          </button>

        </div>


        {/* ===================================================
            ADVANCED SEARCH
        =================================================== */}

        {showAdvancedSearch && (

          <div
            className="advanced-search-box"
          >


            {/* PROJECT */}

            <div className="multi-filter">

              <label>
                Project
              </label>

              <Select

                options={[

                  {
                    value:
                      "Mahamumbai",
                    label:
                      "Mahamumbai"
                  },

                  {
                    value:
                      "6975",
                    label:
                      "Mahamumbai Phase 2"
                  },

                  {
                    value:
                      "7142",
                    label:
                      "Thane (Nitesh)"
                  },

                  {
                    value:
                      "6674",
                    label:
                      "Panvel (99Villa)"
                  },

                  {
                    value:
                      "6673",
                    label:
                      "Thane (Virendra)"
                  },

                  {
                    value:
                      "7517",
                    label:
                      "Affordable life"
                  },

                  {
                    value:
                      "7514",
                    label:
                      "99villa."
                  },

                  {
                    value:
                      "7670",
                    label:
                      "99 villa plot."
                  },

                  {
                    value:
                      "7743",
                    label:
                      "MAHAMUMBAI"
                  },

                  {
                    value:
                      "7747",
                    label:
                      "Khopoli-pali Road plots"
                  },

                  {
                    value:
                      "7843",
                    label:
                      "ANJALI ZAMIN."
                  },

                  {
                    value:
                      "7876",
                    label:
                      "Sheetal THANE."
                  },

                  {
                    value:
                      "7898",
                    label:
                      "THANE...( VIRENDRA)"
                  },

                  {
                    value:
                      "7899",
                    label:
                      "Alibaug Plot."
                  },

                  {
                    value:
                      "7871",
                    label:
                      "Sheetal Campaign."
                  },

                  {
                    value:
                      "7912",
                    label:
                      "Maha-Mumbaai"
                  },

                  {
                    value:
                      "7929",
                    label:
                      "THANE...( VIRENDRAA)"
                  },

                  {
                    value:
                      "7941",
                    label:
                      "Gudipadwa plot in 5 Lacs."
                  }

                ]}

                isSearchable

                isClearable

                value={
                  selectedProjects
                }

                onChange={
                  setSelectedProjects
                }

                placeholder=
                  "Search Project..."

                styles={{

                  control:
                    (base) => ({

                      ...base,

                      minHeight:
                        "45px",

                      borderRadius:
                        "10px"

                    }),

                  menu:
                    (base) => ({

                      ...base,

                      zIndex:
                        9999

                    })

                }}

              />

            </div>


            {/* SOURCE */}

            <div className="multi-filter">

              <label>
                Source
              </label>

              <Select

                options={
                  sourceDropdownOptions
                }

                isMulti

                closeMenuOnSelect={
                  false
                }

                hideSelectedOptions={
                  false
                }

                value={
                  selectedSources
                }

                onChange={
                  setSelectedSources
                }

                placeholder=
                  "Select Source"

              />

            </div>


            {/* SUB SOURCE */}

            <input
              type="text"
              placeholder=
                "Search Sub Source..."
              value={
                subSourceFilter
              }
              onChange={(e) =>
                setSubSourceFilter(
                  e.target.value
                )
              }
            />


            {/* CITY */}

            <div className="multi-filter">

              <label>
                City
              </label>

              <Select

                options={
                  cityDropdownOptions
                }

                isMulti

                closeMenuOnSelect={
                  false
                }

                hideSelectedOptions={
                  false
                }

                value={
                  selectedCities
                }

                onChange={
                  setSelectedCities
                }

                placeholder=
                  "Select City"

              />

            </div>


            {/* EXECUTIVE */}

            <div className="multi-filter">

              <label>
                Executive
              </label>

              <Select

                options={
                  executiveDropdownOptions
                }

                isMulti

                closeMenuOnSelect={
                  false
                }

                hideSelectedOptions={
                  false
                }

                value={
                  selectedExecutives
                }

                onChange={
                  setSelectedExecutives
                }

                placeholder=
                  "Select Executive"

              />

            </div>


            {/* DEPARTMENT */}

            <div className="multi-filter">

              <label>
                Department
              </label>

              <Select

                options={
                  departmentDropdownOptions
                }

                isMulti

                closeMenuOnSelect={
                  false
                }

                hideSelectedOptions={
                  false
                }

                value={
                  selectedDepartments
                }

                onChange={
                  setSelectedDepartments
                }

                placeholder=
                  "Select Department"

              />

            </div>


            {/* ASSIGNED TO */}

            <input
              type="text"
              placeholder=
                "Assigned To..."
              value={
                assignedFilter
              }
              onChange={(e) =>
                setAssignedFilter(
                  e.target.value
                )
              }
            />


            {/* STATUS */}

            <div className="multi-filter">

              <label>
                Status
              </label>

              <Select

                options={
                  statusOptions.map(
                    (status) => ({

                      value:
                        status,

                      label:
                        status

                    })
                  )
                }

                isMulti

                isSearchable

                isClearable

                closeMenuOnSelect={
                  false
                }

                hideSelectedOptions={
                  false
                }

                value={
                  statusFilter
                }

                onChange={(
                  selected
                ) =>
                  setStatusFilter(
                    selected || []
                  )
                }

                placeholder=
                  "Select Status..."

                styles={{

                  control:
                    (
                      base,
                      state
                    ) => ({

                      ...base,

                      minHeight:
                        "45px",

                      borderRadius:
                        "10px",

                      borderColor:
                        state.isFocused
                          ? "#2563eb"
                          : "#d1d5db",

                      boxShadow:
                        "none"

                    }),

                  menu:
                    (base) => ({

                      ...base,

                      zIndex:
                        9999

                    }),

                  menuPortal:
                    (base) => ({

                      ...base,

                      zIndex:
                        99999

                    }),

                  multiValue:
                    (base) => ({

                      ...base,

                      borderRadius:
                        "6px"

                    }),

                  multiValueLabel:
                    (base) => ({

                      ...base,

                      fontWeight:
                        "500"

                    })

                }}

                menuPortalTarget={
                  document.body
                }

              />

            </div>


            {/* CREATED DATE FROM */}

            <div className="date-group">

              <label>
                Created Date From
              </label>

              <input
                type="date"
                value={
                  fromDateFilter
                }
                onChange={(e) =>
                  setFromDateFilter(
                    e.target.value
                  )
                }
              />

            </div>


            {/* CREATED DATE TO */}

            <div className="date-group">

              <label>
                Created Date To
              </label>

              <input
                type="date"
                value={
                  toDateFilter
                }
                onChange={(e) =>
                  setToDateFilter(
                    e.target.value
                  )
                }
              />

            </div>


            {/* NEXT CALL FROM */}

            <div className="date-group">

              <label>
                Next Call Date From
              </label>

              <input
                type="date"
                value={
                  nextCallFrom
                }
                onChange={(e) =>
                  setNextCallFrom(
                    e.target.value
                  )
                }
              />

            </div>


            {/* NEXT CALL TO */}

            <div className="date-group">

              <label>
                Next Call Date To
              </label>

              <input
                type="date"
                value={
                  nextCallTo
                }
                onChange={(e) =>
                  setNextCallTo(
                    e.target.value
                  )
                }
              />

            </div>


            {/* DESCRIPTION */}

            <input
              type="text"
              placeholder=
                "Description..."
              value={
                descriptionFilter
              }
              onChange={(e) =>
                setDescriptionFilter(
                  e.target.value
                )
              }
            />


            {/* CLEAR */}

            <button
              className=
                "clear-filter-btn"

              onClick={
                clearAllFilters
              }
            >

              Clear Filters

            </button>

          </div>

        )}


        {/* ===================================================
            CONTENT
        =================================================== */}

        {loading ? (

          <div className="loader">

            Loading leads...

          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="empty-state">

            No leads found.

          </div>

        ) : (

          <div className="table-wrapper">

            <table
              className="leads-table"
            >

              <thead>

                <tr>

                  <th>
                    Sr No
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Call / Mobile
                  </th>

                  <th>
                    Assigned To
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Source
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Next Call Date
                  </th>

                  <th>
                    Sub Source
                  </th>

                  <th>
                    Created At
                  </th>

                  <th>
                    Last Activity
                  </th>

                  <th>
                    Update Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {currentLeads.map(
                  (
                    lead,
                    index
                  ) => (

                    <tr
                      key={
                        lead._id
                      }
                    >


                      {/* SR NO */}

                      <td>

                        {
                          indexOfFirstLead +
                          index +
                          1
                        }

                      </td>


                      {/* NAME */}

                      <td>

                        {
                          lead.name ||
                          "-"
                        }

                      </td>


                      {/* PHONE */}

                      <td>

                        {
                          lead.phone ||
                          "-"
                        }

                      </td>


                      {/* ASSIGNED */}

                      <td>

                        {
                          lead.assignedTo ||

                          lead.assigned_to_email ||

                          "-"
                        }

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            `status-badge ${
                              lead.status
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`
                          }
                        >

                          {
                            lead.status ||
                            "New"
                          }

                        </span>

                      </td>


                      {/* SOURCE */}

                      <td>

                        {
                          lead.source ||
                          "-"
                        }

                      </td>


                      {/* PROJECT */}

                      <td>

                        {
                          lead.project ||
                          "-"
                        }

                      </td>


                      {/* DESCRIPTION */}

                      <td
                        className=
                          "description-cell"
                      >

                        {
                          lead.description ||
                          "-"
                        }

                      </td>


                      {/* NEXT CALL */}

                      <td>

                        {
                          lead.next_call_date

                            ? String(
                                lead.next_call_date
                              )
                                .split("T")[0]

                            : "-"
                        }

                      </td>


                      {/* SUB SOURCE */}

                      <td>

                        {
                          lead.subSource ||
                          "-"
                        }

                      </td>


                      {/* CREATED */}

                      <td>

                        {
                          lead.createdAt

                            ? new Date(
                                lead.createdAt
                              ).toLocaleString()

                            : "-"
                        }

                      </td>


                      {/* UPDATED */}

                      <td>

                        {
                          lead.updatedAt

                            ? new Date(
                                lead.updatedAt
                              ).toLocaleString()

                            : "-"
                        }

                      </td>


                      {/* UPDATE STATUS */}

                      <td>

                        <select

                          className=
                            "status-select"

                          value={
                            lead.status ||
                            "New"
                          }

                          onChange={(
                            event
                          ) => {

                            const value =
                              event
                                .target
                                .value;


                            /* UI update */

                            setLeads(
                              (
                                previousLeads
                              ) =>

                                previousLeads.map(
                                  (
                                    item
                                  ) =>

                                    item._id ===
                                    lead._id

                                      ? {

                                          ...item,

                                          status:
                                            value

                                        }

                                      : item

                                )
                            );


                            /* MongoDB update */

                            updateStatus(
                              lead._id,
                              value
                            );

                          }}

                        >

                          {statusOptions.map(
                            (
                              status,
                              optionIndex
                            ) => (

                              <option
                                key={
                                  optionIndex
                                }
                                value={
                                  status
                                }
                              >

                                {
                                  status
                                }

                              </option>

                            )
                          )}

                        </select>

                      </td>


                      {/* ACTION */}

                      <td>

                        <div
                          className=
                            "action-buttons"
                        >


                          {/* CALL */}

                          <button

                            className=
                              "call-btn icon-btn"

                            title="Call"

                            onClick={() =>
                              startCall(
                                lead
                              )
                            }

                          >

                            <FaPhoneAlt />

                          </button>


                          {/* WHATSAPP */}

                          <a

                            href={
                              `https://wa.me/91${String(
                                lead.phone ||
                                ""
                              ).replace(
                                /\D/g,
                                ""
                              )}`
                            }

                            target="_blank"

                            rel="noreferrer"

                            className=
                              "whatsapp-btn icon-btn"

                            title="WhatsApp"

                          >

                            <FaWhatsapp />

                          </a>


                          {/* EDIT */}

                          <button

                            className=
                              "edit-btn icon-btn"

                            title="Edit"

                            onClick={() =>
                              openEditModal(
                                lead
                              )
                            }

                          >

                            <FaEdit />

                          </button>


                          {/* BOOKING */}

                          {lead.status ===
                            "Booked" && (

                            <button

                              className=
                                "booking-btn"

                              onClick={() =>
                                openBookingModal(
                                  lead
                                )
                              }

                            >

                              Booking

                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <div
              className="pagination"
            >

              <button

                onClick={
                  handlePrevPage
                }

                disabled={
                  currentPage === 1
                }

                className="page-btn"

              >

                Previous

              </button>


              <span
                className="page-info"
              >

                Page{" "}

                {currentPage}

                {" "}of{" "}

                {totalPages || 1}

              </span>


              <button

                onClick={
                  handleNextPage
                }

                disabled={
                  currentPage ===
                    totalPages ||
                  totalPages === 0
                }

                className="page-btn"

              >

                Next

              </button>

            </div>

          </div>

        )}


        {/* ===================================================
            NEW LEAD MODAL
        =================================================== */}

        {showNewLeadModal && (

          <div
            className="modal-overlay"
          >

            <div
              className=
                "modal-box large-modal"
            >

              <h2>
                Add New Lead
              </h2>


              <div
                className=
                  "lead-form-grid"
              >


                {/* NAME */}

                <input
                  type="text"
                  placeholder="Name"
                  value={
                    newLead.name
                  }
                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      name:
                        e.target.value

                    })
                  }
                />


                {/* PHONE */}

                <input
                  type="text"
                  placeholder="Mobile"
                  value={
                    newLead.phone
                  }
                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      phone:
                        e.target.value

                    })
                  }
                />


                {/* EMAIL */}

                <input
                  type="email"
                  placeholder=
                    "Primary Email"
                  value={
                    newLead.email
                  }
                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      email:
                        e.target.value

                    })
                  }
                />


                {/* PROJECT */}

                <select

                  value={
                    newLead.project
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      project:
                        e.target.value

                    })
                  }

                >

                  <option value="">
                    Please Select Project
                  </option>

                  {projectOptions.map(
                    (
                      project,
                      index
                    ) => (

                      <option
                        key={index}
                        value={project}
                      >

                        {project}

                      </option>

                    )
                  )}

                </select>


                {/* STATUS */}

                <select

                  value={
                    newLead.status
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      status:
                        e.target.value

                    })
                  }

                >

                  <option value="">
                    Lead Status
                  </option>

                  {statusOptions.map(
                    (
                      status,
                      index
                    ) => (

                      <option
                        key={index}
                        value={status}
                      >

                        {status}

                      </option>

                    )
                  )}

                </select>


                {/* NEXT CALL */}

                <input

                  type="date"

                  value={
                    newLead.next_call_date
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      next_call_date:
                        e.target.value

                    })
                  }

                />


                {/* SOURCE */}

                <select

                  value={
                    newLead.source
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      source:
                        e.target.value

                    })
                  }

                >

                  <option value="">
                    Select Source
                  </option>

                  {sourceOptions.map(
                    (
                      source,
                      index
                    ) => (

                      <option
                        key={index}
                        value={source}
                      >

                        {source}

                      </option>

                    )
                  )}

                </select>


                {/* SUB SOURCE */}

                <input

                  type="text"

                  placeholder=
                    "Sub Source"

                  value={
                    newLead.subSource
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      subSource:
                        e.target.value

                    })
                  }

                />


                {/* CITY */}

                <input

                  type="text"

                  placeholder="City"

                  value={
                    newLead.city
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      city:
                        e.target.value

                    })
                  }

                />


                {/* ASSIGNED TO */}

                <input

                  type="text"

                  placeholder=
                    "Assign To"

                  value={
                    newLead.assignedTo
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      assignedTo:
                        e.target.value

                    })
                  }

                />


                {/* CLOSING EXECUTIVE */}

                <input

                  type="text"

                  placeholder=
                    "Closing Executive"

                  value={
                    newLead.closingExecutive
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      closingExecutive:
                        e.target.value

                    })
                  }

                />


                {/* DEPARTMENT */}

                <select

                  value={
                    newLead.department
                  }

                  onChange={(e) =>
                    setNewLead({

                      ...newLead,

                      department:
                        e.target.value

                    })
                  }

                >

                  <option value="">
                    Please Select Department
                  </option>

                  {departmentOptions.map(
                    (
                      department,
                      index
                    ) => (

                      <option
                        key={index}
                        value={department}
                      >

                        {department}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* ===========================================
                  DEAD REASON
              =========================================== */}

              {newLead.status ===
                "Not Interested" && (

                <div
                  className=
                    "lead-form-grid"
                >

                  <select

                    value={
                      newLead.deadReason
                    }

                    onChange={(e) =>
                      setNewLead({

                        ...newLead,

                        deadReason:
                          e.target.value

                      })
                    }

                  >

                    <option value="">
                      Dead Reason
                    </option>

                    {deadReasonOptions.map(
                      (
                        reason,
                        index
                      ) => (

                        <option
                          key={index}
                          value={reason}
                        >

                          {reason}

                        </option>

                      )
                    )}

                  </select>


                  <input

                    type="text"

                    placeholder=
                      "Dead Sub Reason"

                    value={
                      newLead.deadSubReason
                    }

                    onChange={(e) =>
                      setNewLead({

                        ...newLead,

                        deadSubReason:
                          e.target.value

                      })
                    }

                  />

                </div>

              )}


              {/* ===========================================
                  BOOKING DATE
              =========================================== */}

              {newLead.status ===
                "Booked" && (

                <div
                  className=
                    "lead-form-grid"
                >

                  <input

                    type="date"

                    value={
                      newLead.bookingDate
                    }

                    onChange={(e) =>
                      setNewLead({

                        ...newLead,

                        bookingDate:
                          e.target.value

                      })
                    }

                  />

                </div>

              )}


              {/* COMMENT */}

              <textarea

                placeholder=
                  "Comment"

                rows="4"

                value={
                  newLead.description
                }

                onChange={(e) =>
                  setNewLead({

                    ...newLead,

                    description:
                      e.target.value

                  })
                }

              />


              {/* BUTTONS */}

              <div
                className=
                  "modal-actions"
              >

                <button

                  className=
                    "cancel-btn"

                  onClick={() =>
                    setShowNewLeadModal(
                      false
                    )
                  }

                >

                  Cancel

                </button>


                <button

                  className=
                    "save-btn"

                  onClick={
                    handleAddNewLead
                  }

                >

                  Save Lead

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}