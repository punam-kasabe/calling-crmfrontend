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

/* =========================================================
   COMPONENT
========================================================= */

export default function MyLeads() {

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  /* =======================================================
     LEADS
  ======================================================= */

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  /* =======================================================
     STATUS FILTER
  ======================================================= */

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");

  /* =======================================================
     MODALS
  ======================================================= */

  const [selectedLead, setSelectedLead] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showNewLeadModal, setShowNewLeadModal] =
    useState(false);

  const [showBookingModal, setShowBookingModal] =
    useState(false);

  /* =======================================================
     BOOKING
  ======================================================= */

  const [bookingData, setBookingData] = useState({
    unitNo: "",
    bookingAmount: ""
  });

  /* =======================================================
     ADVANCED SEARCH
  ======================================================= */

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

  /* =======================================================
     SELECT FILTERS
  ======================================================= */

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

  /* =======================================================
     CALL
  ======================================================= */

  const [callModal, setCallModal] = useState(false);

  const [activeCall, setActiveCall] = useState(null);

  const [callStartTime, setCallStartTime] =
    useState(null);

  const [callDuration, setCallDuration] =
    useState("");

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const leadsPerPage = 10;

  /* =======================================================
     NEW LEAD
  ======================================================= */

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
    assigned_to: "",
    closingExecutive: "",
    next_call_date: "",
    department: "",
    description: "",
    deadReason: "",
    deadSubReason: "",
    bookingDate: ""
  });

  /* =======================================================
     PROJECT OPTIONS
  ======================================================= */

  const projectOptions = [
    "99villa.",
    "99 villa plot.",
    "Affordable life",
    "Alibaug Plot.",
    "Gudipadwa plot in 5 Lacs.",
    "Khopoli-pali Road plots",
    "Mahamumbai",
    "Mahamumbai Phase 2",
    "Panvel (99Villa)",
    "THANE...( VIRENDRAA)"
  ];

  /* =======================================================
     STATUS OPTIONS
  ======================================================= */

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

  /* =======================================================
     DEAD REASON
  ======================================================= */

  const deadReasonOptions = [
    "Budget Issue",
    "Location Issue",
    "Other"
  ];

  /* =======================================================
     SOURCE
  ======================================================= */

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
  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const departmentOptions = [
  "Sales/Marketing",
  "HR/Admin",
  "Aasma Madam",
  "Nilesh Sir",
  "Telecaller"
];

  /* =======================================================
     SOURCE DROPDOWN
  ======================================================= */

  const sourceDropdownOptions = useMemo(() => {
  return sourceOptions.map((item) => ({
    value: item,
    label: item
  }));
}, [sourceOptions]);

  /* =======================================================
     DEPARTMENT DROPDOWN
  ======================================================= */

  const departmentDropdownOptions = useMemo(() => {
  return departmentOptions.map((item) => ({
    value: item,
    label: item
  }));
}, [departmentOptions]);
  /* =======================================================
     USER
  ======================================================= */

  const user = useMemo(() => {

    try {

      return (
        JSON.parse(
          localStorage.getItem("user")
        ) || {}
      );

    } catch (error) {

      console.error(
        "Invalid user data in localStorage",
        error
      );

      return {};
    }

  }, []);

  /* =======================================================
     EXECUTIVE DROPDOWN OPTIONS
  ======================================================= */

  const executiveDropdownOptions = useMemo(() => {

    const values = [
      ...new Set(
        leads
          .map(
            (lead) =>
              lead.closingExecutive
          )
          .filter(Boolean)
      )
    ];

    return values.map((item) => ({
      value: item,
      label: item
    }));

  }, [leads]);

  /* =======================================================
     CITY DROPDOWN OPTIONS
  ======================================================= */

  const cityDropdownOptions = useMemo(() => {

    const values = [
      ...new Set(
        leads
          .map(
            (lead) =>
              lead.city
          )
          .filter(Boolean)
      )
    ];

    return values.map((item) => ({
      value: item,
      label: item
    }));

  }, [leads]);

  /* =======================================================
     PROJECT FILTER OPTIONS
  ======================================================= */

  const projectFilterOptions = [
    {
      value: "Mahamumbai",
      label: "Mahamumbai"
    },
    {
      value: "6975",
      label: "Mahamumbai Phase 2"
    },
    {
      value: "7142",
      label: "Thane (Nitesh)"
    },
    {
      value: "6674",
      label: "Panvel (99Villa)"
    },
    {
      value: "6673",
      label: "Thane (Virendra)"
    },
    {
      value: "7517",
      label: "Affordable life"
    },
    {
      value: "7514",
      label: "99villa."
    },
    {
      value: "7670",
      label: "99 villa plot."
    },
    {
      value: "7743",
      label: "MAHAMUMBAI"
    },
    {
      value: "7747",
      label: "Khopoli-pali Road plots"
    },
    {
      value: "7843",
      label: "ANJALI ZAMIN."
    },
    {
      value: "7876",
      label: "Sheetal THANE."
    },
    {
      value: "7898",
      label: "THANE...( VIRENDRA)"
    },
    {
      value: "7899",
      label: "Alibaug Plot."
    },
    {
      value: "7871",
      label: "Sheetal Campaign."
    },
    {
      value: "7912",
      label: "Maha-Mumbaai"
    },
    {
      value: "7929",
      label: "THANE...( VIRENDRAA)"
    },
    {
      value: "7941",
      label: "Gudipadwa plot in 5 Lacs."
    }
  ];

  /* =======================================================
     STATUS CHECKBOX
  ======================================================= */

  const handleStatusCheckbox = (status) => {

    setStatusFilter("");

    setSelectedStatuses((prev) => {

      if (prev.includes(status)) {

        return prev.filter(
          (item) => item !== status
        );
      }

      return [
        ...prev,
        status
      ];

    });
  };

  /* =======================================================
     SELECT ALL STATUS
  ======================================================= */

  const handleSelectAllStatuses = () => {

    setStatusFilter("");

    if (
      selectedStatuses.length ===
      statusOptions.length
    ) {

      setSelectedStatuses([]);

    } else {

      setSelectedStatuses([
        ...statusOptions
      ]);
    }
  };

  const isAllStatusesSelected =
    statusOptions.length > 0 &&
    selectedStatuses.length ===
      statusOptions.length;

  /* =======================================================
     FETCH MY LEADS
  ======================================================= */

  const fetchMyLeads = useCallback(
    async () => {

      if (!user?.email) {

        setLeads([]);

        setLoading(false);

        return;
      }

      try {

        setLoading(true);

        const response =
          await axios.get(
            `${API}/my-leads`,
            {
              params: {
                email: user.email
              }
            }
          );

        const data =
          Array.isArray(response.data)
            ? response.data
            : response.data?.leads || [];

        setLeads(data);

      } catch (error) {

        console.error(
          "Error fetching my leads:",
          error
        );

        setLeads([]);

      } finally {

        setLoading(false);

      }

    },
    [user?.email]
  );

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {

    fetchMyLeads();

  }, [fetchMyLeads]);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const updateStatus = async (
    leadId,
    status
  ) => {

    try {

      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
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

      const executiveEmail =
        currentUser?.email ||
        user?.email ||
        "";

      const response =
        await axios.put(
          `${API}/update-status/${leadId}`,
          {
            status,
            executive_email:
              executiveEmail
          }
        );

      console.log(
        "Status Update Response:",
        response.data
      );

      /* ---------------------------------------------------
         Immediate UI update
      --------------------------------------------------- */

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                status,
                updatedAt:
                  new Date().toISOString()
              }
            : lead
        )
      );

      /* ---------------------------------------------------
         Refresh from MongoDB
      --------------------------------------------------- */

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
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Status update failed ❌"
      );

      /* Refresh so UI matches DB */

      await fetchMyLeads();
    }
  };

  /* =======================================================
     UPDATE LEAD
  ======================================================= */

  const handleUpdateLead = async () => {

    if (!selectedLead?._id) {

      alert(
        "Lead ID missing ❌"
      );

      return;
    }

    try {

      const updatedData = {

        executive_email:
          selectedLead.executive_email ||
          user.email,

        name:
          selectedLead.name || "",

        phone:
          selectedLead.phone || "",

        email:
          selectedLead.email || "",

        assignedTo:
          selectedLead.assignedTo || "",

        assigned_to_email:
          selectedLead.assigned_to_email ||
          user.email ||
          "",

        assigned_to:
          selectedLead.assigned_to_email ||
          selectedLead.assigned_to ||
          user.email ||
          "",

        closingExecutive:
          selectedLead.closingExecutive || "",

        status:
          selectedLead.status || "New",

        source:
          selectedLead.source || "",

        subSource:
          selectedLead.subSource || "",

        city:
          selectedLead.city || "",

        project:
          selectedLead.project || "",

        next_call_date:
          selectedLead.next_call_date || "",

        description:
          selectedLead.description || "",

        department:
          selectedLead.department || "",

        deadReason:
          selectedLead.deadReason || "",

        deadSubReason:
          selectedLead.deadSubReason || "",

        bookingDate:
          selectedLead.bookingDate || ""
      };

      const response =
        await axios.put(
          `${API}/update-lead/${selectedLead._id}`,
          updatedData
        );

      console.log(
        "Lead update response:",
        response.data
      );

      /* ---------------------------------------------------
         Update local UI
      --------------------------------------------------- */

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === selectedLead._id
            ? {
                ...lead,
                ...updatedData,
                updatedAt:
                  new Date().toISOString()
              }
            : lead
        )
      );

      setShowModal(false);

      setSelectedLead(null);

      await fetchMyLeads();

      alert(
        "Lead Updated Successfully ✅"
      );

    } catch (error) {

      console.error(
        "Lead update failed:",
        error
      );

      console.error(
        "Backend:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Update Failed ❌"
      );
    }
  };

  /* =======================================================
     START CALL
  ======================================================= */

  const startCall = async (lead) => {

    if (!lead?.phone) {

      alert(
        "Phone number not available ❌"
      );

      return;
    }

    setActiveCall(lead);

    setCallStartTime(
      new Date()
    );

    setCallDuration(
      "0 sec"
    );

    /* ---------------------------------------------------
       Open phone
    --------------------------------------------------- */

    window.open(
      `tel:${String(
        lead.phone
      ).replace(/\D/g, "")}`
    );

    /* ---------------------------------------------------
       Show call modal after 3 seconds
    --------------------------------------------------- */

    setTimeout(() => {

      setCallModal(true);

    }, 3000);
  };

  /* =======================================================
     CALL TIMER
  ======================================================= */

  useEffect(() => {

    let interval = null;

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

        clearInterval(interval);

      }
    };

  }, [
    callModal,
    callStartTime
  ]);

  /* =======================================================
     CREATE BOOKING
  ======================================================= */

  const handleCreateBooking =
    async () => {

      if (!selectedLead?._id) {

        alert(
          "Lead not selected ❌"
        );

        return;
      }

      if (!bookingData.unitNo) {

        alert(
          "Please enter Unit No ❌"
        );

        return;
      }

      if (!bookingData.bookingAmount) {

        alert(
          "Please enter Booking Amount ❌"
        );

        return;
      }

      try {

        const response =
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
                selectedLead.closingExecutive,

              attendingOfficer:
                selectedLead.assignedTo,

              unitNo:
                bookingData.unitNo,

              bookingAmount:
                bookingData.bookingAmount
            }
          );

        console.log(
          "Booking response:",
          response.data
        );

        alert(
          "Booking Added Successfully ✅"
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
          "Backend:",
          error.response?.data
        );

        alert(
          error.response?.data?.message ||
          "Booking Failed ❌"
        );
      }
    };

  /* =======================================================
     ADD NEW LEAD
  ======================================================= */

  const handleAddNewLead =
    async () => {

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

        const payload = {

          ...newLead,

          executive_email:
            newLead.executive_email ||
            user.email ||
            "",

          assignedTo:
            newLead.assignedTo ||
            user.name ||
            user.username ||
            "",

          assigned_to_email:
            newLead.assigned_to_email ||
            user.email ||
            "",

          assigned_to:
            newLead.assigned_to ||
            newLead.assigned_to_email ||
            user.email ||
            "",

          closingExecutive:
            newLead.closingExecutive ||
            user.name ||
            user.username ||
            ""
        };

        const response =
          await axios.post(
            `${API}/add-lead`,
            payload
          );

        console.log(
          "New Lead Response:",
          response.data
        );

        const createdLead =
          response.data?.lead ||
          response.data;

        if (
          createdLead &&
          typeof createdLead ===
            "object"
        ) {

          setLeads((prev) => [
            createdLead,
            ...prev
          ]);
        }

        alert(
          "Lead Added Successfully ✅"
        );

        setShowNewLeadModal(
          false
        );

        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        setNewLead({
          name: "",
          phone: "",
          email: "",
          executive_email:
            user.email || "",
          project: "",
          status: "New",
          source: "",
          subSource: "",
          city: "",
          assignedTo:
            user.name ||
            user.username ||
            "",
          assigned_to_email:
            user.email || "",
          assigned_to:
            user.email || "",
          closingExecutive:
            user.name ||
            user.username ||
            "",
          next_call_date: "",
          department: "",
          description: "",
          deadReason: "",
          deadSubReason: "",
          bookingDate: ""
        });

        await fetchMyLeads();

      } catch (error) {

        console.error(
          "Add lead failed:",
          error
        );

        console.error(
          "Backend:",
          error.response?.data
        );

        alert(
          error.response?.data?.message ||
          "Failed To Add Lead ❌"
        );
      }
    };

  /* =======================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    selectedStatuses,
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
    /* =======================================================
     FILTERED LEADS
  ======================================================= */

  const filteredLeads = useMemo(() => {

    return leads.filter((lead) => {

      /* ---------------------------------------------------
         GLOBAL SEARCH
      --------------------------------------------------- */

      const searchText = `
        ${lead.name || ""}
        ${lead.phone || ""}
        ${lead.project || ""}
        ${lead.source || ""}
        ${lead.closingExecutive || ""}
        ${lead.assignedTo || ""}
        ${lead.description || ""}
        ${lead.subSource || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase().trim()
        );

      /* ---------------------------------------------------
         STATUS
      --------------------------------------------------- */

      const matchesStatus =
        statusFilter
          ? lead.status ===
            statusFilter
          : selectedStatuses.length === 0
          ? true
          : selectedStatuses.includes(
              lead.status
            );

      /* ---------------------------------------------------
         PROJECT
      --------------------------------------------------- */

      const matchesProject =
        selectedProjects
          ? (
              lead.project ===
                selectedProjects.value ||
              lead.project ===
                selectedProjects.label ||
              String(lead.project) ===
                String(
                  selectedProjects.value
                )
            )
          : true;

      /* ---------------------------------------------------
         SOURCE
      --------------------------------------------------- */

      const matchesSource =
        selectedSources.length > 0
          ? selectedSources.some(
              (item) =>
                item.value ===
                lead.source
            )
          : true;

      /* ---------------------------------------------------
         EXECUTIVE
      --------------------------------------------------- */

      const matchesExecutive =
        selectedExecutives.length > 0
          ? selectedExecutives.some(
              (item) =>
                item.value ===
                lead.closingExecutive
            )
          : true;

      /* ---------------------------------------------------
         CITY
      --------------------------------------------------- */

      const matchesCity =
        selectedCities.length > 0
          ? selectedCities.some(
              (item) =>
                item.value ===
                lead.city
            )
          : true;

      /* ---------------------------------------------------
         DEPARTMENT
      --------------------------------------------------- */

      const matchesDepartment =
        selectedDepartments.length > 0
          ? selectedDepartments.some(
              (item) =>
                item.value ===
                lead.department
            )
          : true;

      /* ---------------------------------------------------
         ASSIGNED TO
      --------------------------------------------------- */

      const assignedValue =
        String(
          lead.assignedTo ||
          lead.assigned_to ||
          lead.assigned_to_email ||
          ""
        ).toLowerCase();

      const matchesAssigned =
        assignedFilter
          ? assignedValue.includes(
              assignedFilter
                .toLowerCase()
                .trim()
            )
          : true;

      /* ---------------------------------------------------
         DESCRIPTION
      --------------------------------------------------- */

      const descriptionValue =
        String(
          lead.description || ""
        ).toLowerCase();

      const matchesDescription =
        descriptionFilter
          ? descriptionValue.includes(
              descriptionFilter
                .toLowerCase()
                .trim()
            )
          : true;

      /* ---------------------------------------------------
         CREATED DATE
      --------------------------------------------------- */

      let createdDate = "";

      if (lead.createdAt) {

        const date =
          new Date(
            lead.createdAt
          );

        if (
          !Number.isNaN(
            date.getTime()
          )
        ) {

          createdDate =
            date
              .toISOString()
              .split("T")[0];
        }
      }

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

      /* ---------------------------------------------------
         SUB SOURCE
      --------------------------------------------------- */

      const subSourceValue =
        String(
          lead.subSource || ""
        ).toLowerCase();

      const matchesSubSource =
        subSourceFilter
          ? subSourceValue.includes(
              subSourceFilter
                .toLowerCase()
                .trim()
            )
          : true;

      /* ---------------------------------------------------
         NEXT CALL DATE
      --------------------------------------------------- */

      let nextCallDate = "";

      if (
        lead.next_call_date
      ) {

        const raw =
          String(
            lead.next_call_date
          );

        nextCallDate =
          raw.includes("T")
            ? raw.split("T")[0]
            : raw.substring(0, 10);
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

      /* ---------------------------------------------------
         FINAL RESULT
      --------------------------------------------------- */

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

    });

  }, [
    leads,
    search,
    statusFilter,
    selectedStatuses,
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

  /* =======================================================
     PAGINATION
  ======================================================= */

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

  /* =======================================================
     NEXT PAGE
  ======================================================= */

  const handleNextPage = () => {

    if (
      currentPage <
      totalPages
    ) {

      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  /* =======================================================
     PREVIOUS PAGE
  ======================================================= */

  const handlePrevPage = () => {

    if (
      currentPage > 1
    ) {

      setCurrentPage(
        (prev) => prev - 1
      );
    }
  };

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {

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

  }, [filteredLeads]);

  /* =======================================================
     CARD CLICK
  ======================================================= */

  const handleCardClick =
    (status) => {

      if (
        status === "TOTAL"
      ) {

        setStatusFilter("");

        setSelectedStatuses([]);

      } else {

        setStatusFilter(
          status
        );

        setSelectedStatuses([]);
      }

      setCurrentPage(1);
    };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("");

    setSelectedStatuses([]);

    setSelectedProjects(null);

    setSelectedSources([]);

    setSelectedDepartments([]);

    setSelectedExecutives([]);

    setSelectedCities([]);

    setSubSourceFilter("");

    setAssignedFilter("");

    setFromDateFilter("");

    setToDateFilter("");

    setNextCallFrom("");

    setNextCallTo("");

    setDescriptionFilter("");

    setCurrentPage(1);
  };

  /* =======================================================
     OPEN NEW LEAD MODAL
  ======================================================= */

  const openNewLeadModal = () => {

    setNewLead({

      name: "",

      phone: "",

      email: "",

      executive_email:
        user.email || "",

      project: "",

      status: "New",

      source: "",

      subSource: "",

      city: "",

      assignedTo:
        user.name ||
        user.username ||
        "",

      assigned_to_email:
        user.email || "",

      assigned_to:
        user.email || "",

      closingExecutive:
        user.name ||
        user.username ||
        "",

      next_call_date: "",

      department: "",

      description: "",

      deadReason: "",

      deadSubReason: "",

      bookingDate: ""
    });

    setShowNewLeadModal(true);
  };

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const handleExportCSV = () => {

    if (
      filteredLeads.length === 0
    ) {

      alert(
        "No leads to export ❌"
      );

      return;
    }

    const headers = [
      "Name",
      "Mobile",
      "Email",
      "Assigned To",
      "Assigned Email",
      "Closing Executive",
      "Status",
      "Source",
      "Sub Source",
      "Project",
      "City",
      "Department",
      "Description",
      "Next Call Date",
      "Created At",
      "Last Activity"
    ];

    const escapeCSV = (
      value
    ) => {

      const text =
        value === null ||
        value === undefined
          ? ""
          : String(value);

      return `"${text.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = [
      headers.join(",")
    ];

    filteredLeads.forEach(
      (lead) => {

        const row = [

          escapeCSV(
            lead.name
          ),

          escapeCSV(
            lead.phone
          ),

          escapeCSV(
            lead.email
          ),

          escapeCSV(
            lead.assignedTo ||
            lead.assigned_to ||
            ""
          ),

          escapeCSV(
            lead.assigned_to_email
          ),

          escapeCSV(
            lead.closingExecutive
          ),

          escapeCSV(
            lead.status
          ),

          escapeCSV(
            lead.source
          ),

          escapeCSV(
            lead.subSource
          ),

          escapeCSV(
            lead.project
          ),

          escapeCSV(
            lead.city
          ),

          escapeCSV(
            lead.department
          ),

          escapeCSV(
            lead.description
          ),

          escapeCSV(
            lead.next_call_date
              ? String(
                  lead.next_call_date
                ).split("T")[0]
              : ""
          ),

          escapeCSV(
            lead.createdAt
          ),

          escapeCSV(
            lead.updatedAt
          )
        ];

        rows.push(
          row.join(",")
        );
      }
    );

    const blob =
      new Blob(
        [
          rows.join("\n")
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

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "my-leads.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    window.URL.revokeObjectURL(
      url
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="layout">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={
          toggleSidebar
        }
      />

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div
        className={`main-content ${
          isOpen
            ? "shifted"
            : "full"
        }`}
      >

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="page-header">

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

        {/* ================================================
            STATS
        ================================================= */}

        <div className="stats-grid">

          <div
            className={`stats-card ${
              statusFilter === ""
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

          <div
            className={`stats-card new ${
              statusFilter ===
              "New"
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

          <div
            className={`stats-card interested ${
              statusFilter ===
              "Interested"
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

          <div
            className={`stats-card booked ${
              statusFilter ===
              "Booked"
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

          <div
            className={`stats-card followup ${
              statusFilter ===
              "Follow Up"
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

          <div
            className={`stats-card not ${
              statusFilter ===
              "Not Interested"
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

          <div
            className={`stats-card sitevisit ${
              statusFilter ===
              "Site Visit Done"
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

        {/* ================================================
            GLOBAL SEARCH
        ================================================= */}

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

        {/* ================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="top-actions">

          <button
            className="advanced-btn"
            onClick={() =>
              setShowAdvancedSearch(
                (prev) => !prev
              )
            }
          >

            {showAdvancedSearch
              ? "Hide Advanced Search"
              : "Advanced Search"}

          </button>

          <button
            className="newlead-btn"
            onClick={
              openNewLeadModal
            }
          >

            + New Lead

          </button>

          <button
            className="export-btn"
            onClick={
              handleExportCSV
            }
          >

            Export CSV

          </button>

        </div>

        {/* ================================================
            ADVANCED SEARCH
        ================================================= */}

        {showAdvancedSearch && (

          <div className="advanced-search-box">

            {/* PROJECT */}

            <div className="multi-filter">

              <label>
                Project
              </label>

              <Select
                options={
                  projectFilterOptions
                }
                isSearchable
                isClearable
                value={
                  selectedProjects
                }
                onChange={
                  setSelectedProjects
                }
                placeholder="Search Project..."
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
                placeholder="Select Source"
              />

            </div>

            {/* SUB SOURCE */}

            <input
              type="text"
              placeholder="Search Sub Source..."
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
                placeholder="Select City"
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
                placeholder="Select Executive"
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
                placeholder="Select Department"
              />

            </div>

            {/* ASSIGNED */}

            <input
              type="text"
              placeholder="Assigned To..."
              value={
                assignedFilter
              }
              onChange={(e) =>
                setAssignedFilter(
                  e.target.value
                )
              }
            />

            {/* ==========================================
                STATUS CHECKBOX
            =========================================== */}

            <div className="status-checkbox-filter">

              <div className="status-checkbox-header">

                <label>
                  Status
                </label>

                <label className="select-all-status">

                  <input
                    type="checkbox"
                    checked={
                      isAllStatusesSelected
                    }
                    onChange={
                      handleSelectAllStatuses
                    }
                  />

                  Select All

                </label>

              </div>

              <div className="status-checkbox-list">

                {statusOptions.map(
                  (status) => (

                    <label
                      key={status}
                      className="status-checkbox-item"
                    >

                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(
                          status
                        )}
                        onChange={() =>
                          handleStatusCheckbox(
                            status
                          )
                        }
                      />

                      <span>
                        {status}
                      </span>

                    </label>

                  )
                )}

              </div>

              {selectedStatuses.length >
                0 && (

                <div className="selected-status-count">

                  {selectedStatuses.length}
                  {" "}
                  Status Selected

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStatuses(
                        []
                      )
                    }
                  >
                    Clear
                  </button>

                </div>

              )}

            </div>

            {/* ==========================================
                CREATED FROM
            =========================================== */}

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

            {/* CREATED TO */}

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
              placeholder="Description..."
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
              className="clear-filter-btn"
              onClick={
                clearFilters
              }
            >

              Clear Filters

            </button>

          </div>

        )}

        {/* ================================================
            CONTENT
        ================================================= */}

        {loading ? (

          <div className="loader">

            Loading leads...

          </div>

        ) : filteredLeads.length ===
          0 ? (

          <div className="empty-state">

            No leads found.

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="leads-table">

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
                        lead._id ||
                        `${lead.phone}-${index}`
                      }
                    >

                      <td>
                        {indexOfFirstLead +
                          index +
                          1}
                      </td>

                      <td>
                        {lead.name ||
                          "-"}
                      </td>

                      <td>
                        {lead.phone ||
                          "-"}
                      </td>

                      <td>

                        {lead.assignedTo ||
                          lead.assigned_to ||
                          lead.assigned_to_email ||
                          "-"}

                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            String(
                              lead.status ||
                              "New"
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >

                          {lead.status ||
                            "New"}

                        </span>

                      </td>

                      <td>
                        {lead.source ||
                          "-"}
                      </td>

                      <td>
                        {lead.project ||
                          "-"}
                      </td>

                      <td className="description-cell">

                        {lead.description ||
                          "-"}

                      </td>

                      <td>

                        {lead.next_call_date
                          ? String(
                              lead.next_call_date
                            ).split(
                              "T"
                            )[0]
                          : "-"}

                      </td>

                      <td>
                        {lead.subSource ||
                          "-"}
                      </td>

                      <td>

                        {lead.createdAt
                          ? new Date(
                              lead.createdAt
                            ).toLocaleString()
                          : "-"}

                      </td>

                      <td>

                        {lead.updatedAt
                          ? new Date(
                              lead.updatedAt
                            ).toLocaleString()
                          : "-"}

                      </td>

                      {/* STATUS UPDATE */}

                      <td>

                        <select
                          className="status-select"
                          value={
                            lead.status ||
                            "New"
                          }
                          onChange={async (
                            e
                          ) => {

                            const value =
                              e.target
                                .value;

                            /* Immediate UI */

                            setLeads(
                              (prev) =>
                                prev.map(
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

                            await updateStatus(
                              lead._id,
                              value
                            );

                          }}
                        >

                          {statusOptions.map(
                            (
                              status
                            ) => (

                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {status}
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          {/* CALL */}

                          <button
                            className="call-btn icon-btn"
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
                            href={`https://wa.me/91${String(
                              lead.phone ||
                              ""
                            ).replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="whatsapp-btn icon-btn"
                            title="WhatsApp"
                          >

                            <FaWhatsapp />

                          </a>

                          {/* EDIT */}

                          <button
                            className="edit-btn icon-btn"
                            title="Edit"
                            onClick={() => {

                              setSelectedLead(
                                {
                                  ...lead,

                                  executive_email:
                                    lead.executive_email ||
                                    user.email,

                                  assignedTo:
                                    lead.assignedTo ||
                                    "",

                                  assigned_to_email:
                                    lead.assigned_to_email ||
                                    user.email ||
                                    "",

                                  assigned_to:
                                    lead.assigned_to ||
                                    lead.assigned_to_email ||
                                    user.email ||
                                    "",

                                  next_call_date:
                                    lead.next_call_date
                                      ? String(
                                          lead.next_call_date
                                        ).split(
                                          "T"
                                        )[0]
                                      : ""
                                }
                              );

                              setShowModal(
                                true
                              );

                            }}
                          >

                            <FaEdit />

                          </button>

                          {/* BOOKING */}

                          {lead.status ===
                            "Booked" && (

                            <button
                              className="booking-btn"
                              onClick={() => {

                                setSelectedLead(
                                  lead
                                );

                                setBookingData(
                                  {
                                    unitNo:
                                      "",
                                    bookingAmount:
                                      ""
                                  }
                                );

                                setShowBookingModal(
                                  true
                                );

                              }}
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

            {/* ==========================================
                PAGINATION
            =========================================== */}

            <div className="pagination">

              <button
                onClick={
                  handlePrevPage
                }
                disabled={
                  currentPage ===
                  1
                }
                className="page-btn"
              >

                Previous

              </button>

              <span className="page-info">

                Page{" "}
                {currentPage}{" "}
                of{" "}
                {totalPages || 1}

              </span>

              <button
                onClick={
                  handleNextPage
                }
                disabled={
                  currentPage ===
                    totalPages ||
                  totalPages ===
                    0
                }
                className="page-btn"
              >

                Next

              </button>

            </div>

          </div>

        )}
                {/* =================================================
            NEW LEAD MODAL
        ================================================== */}

        {showNewLeadModal && (

          <div className="modal-overlay">

            <div className="modal-box large-modal">

              <h2>
                Add New Lead
              </h2>

              <div className="lead-form-grid">

                {/* NAME */}

                <input
                  type="text"
                  placeholder="Name"
                  value={
                    newLead.name
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target.value
                      })
                    )
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
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        phone:
                          e.target.value
                      })
                    )
                  }
                />

                {/* EMAIL */}

                <input
                  type="email"
                  placeholder="Primary Email"
                  value={
                    newLead.email
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        email:
                          e.target.value
                      })
                    )
                  }
                />

                {/* PROJECT */}

                <select
                  value={
                    newLead.project
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        project:
                          e.target.value
                      })
                    )
                  }
                >

                  <option value="">
                    Please Select Project
                  </option>

                  {projectOptions.map(
                    (
                      project
                    ) => (

                      <option
                        key={
                          project
                        }
                        value={
                          project
                        }
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
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        status:
                          e.target.value
                      })
                    )
                  }
                >

                  <option value="">
                    Lead Status
                  </option>

                  {statusOptions.map(
                    (
                      status
                    ) => (

                      <option
                        key={
                          status
                        }
                        value={
                          status
                        }
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
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        next_call_date:
                          e.target.value
                      })
                    )
                  }
                />

                {/* SOURCE */}

                <select
                  value={
                    newLead.source
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        source:
                          e.target.value
                      })
                    )
                  }
                >

                  <option value="">
                    Select Source
                  </option>

                  {sourceOptions.map(
                    (
                      source
                    ) => (

                      <option
                        key={
                          source
                        }
                        value={
                          source
                        }
                      >
                        {source}
                      </option>

                    )
                  )}

                </select>

                {/* SUB SOURCE */}

                <input
                  type="text"
                  placeholder="Sub Source"
                  value={
                    newLead.subSource
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        subSource:
                          e.target.value
                      })
                    )
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
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        city:
                          e.target.value
                      })
                    )
                  }
                />

                {/* ASSIGNED TO */}

                <input
                  type="text"
                  placeholder="Assign To"
                  value={
                    newLead.assignedTo
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        assignedTo:
                          e.target.value
                      })
                    )
                  }
                />

                {/* CLOSING EXECUTIVE */}

                <input
                  type="text"
                  placeholder="Closing Executive"
                  value={
                    newLead.closingExecutive
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        closingExecutive:
                          e.target.value
                      })
                    )
                  }
                />

                {/* DEPARTMENT */}

                <select
                  value={
                    newLead.department
                  }
                  onChange={(e) =>
                    setNewLead(
                      (prev) => ({
                        ...prev,
                        department:
                          e.target.value
                      })
                    )
                  }
                >

                  <option value="">
                    Please Select Department
                  </option>

                  {departmentOptions.map(
                    (
                      department
                    ) => (

                      <option
                        key={
                          department
                        }
                        value={
                          department
                        }
                      >
                        {department}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* ==========================================
                  DEAD REASON
              =========================================== */}

              {newLead.status ===
                "Not Interested" && (

                <div className="lead-form-grid">

                  <select
                    value={
                      newLead.deadReason
                    }
                    onChange={(e) =>
                      setNewLead(
                        (prev) => ({
                          ...prev,
                          deadReason:
                            e.target.value
                        })
                      )
                    }
                  >

                    <option value="">
                      Dead Reason
                    </option>

                    {deadReasonOptions.map(
                      (
                        reason
                      ) => (

                        <option
                          key={
                            reason
                          }
                          value={
                            reason
                          }
                        >
                          {reason}
                        </option>

                      )
                    )}

                  </select>

                  <input
                    type="text"
                    placeholder="Dead Sub Reason"
                    value={
                      newLead.deadSubReason
                    }
                    onChange={(e) =>
                      setNewLead(
                        (prev) => ({
                          ...prev,
                          deadSubReason:
                            e.target.value
                        })
                      )
                    }
                  />

                </div>

              )}

              {/* ==========================================
                  BOOKING DATA
              =========================================== */}

              {newLead.status ===
                "Booked" && (

                <div className="lead-form-grid">

                  <input
                    type="date"
                    value={
                      newLead.bookingDate
                    }
                    onChange={(e) =>
                      setNewLead(
                        (prev) => ({
                          ...prev,
                          bookingDate:
                            e.target.value
                        })
                      )
                    }
                  />

                  <input
                    type="file"
                    onChange={() => {}}
                  />

                </div>

              )}

              {/* DESCRIPTION */}

              <textarea
                placeholder="Comment"
                rows="4"
                value={
                  newLead.description
                }
                onChange={(e) =>
                  setNewLead(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value
                    })
                  )
                }
              />

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowNewLeadModal(
                      false
                    )
                  }
                >

                  Cancel

                </button>

                <button
                  className="save-btn"
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

        {/* =================================================
            EDIT LEAD MODAL
        ================================================== */}

        {showModal &&
          selectedLead && (

            <div className="modal-overlay">

              <div className="modal-box large-modal">

                <h2>
                  Edit Lead
                </h2>

                <div className="lead-form-grid">

                  {/* STATUS */}

                  <div>

                    <label>
                      Status
                    </label>

                    <select
                      value={
                        selectedLead.status ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedLead(
                          (prev) => ({
                            ...prev,
                            status:
                              e.target.value
                          })
                        )
                      }
                    >

                      <option value="">
                        Select Status
                      </option>

                      {statusOptions.map(
                        (
                          status
                        ) => (

                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {status}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* PROJECT */}

                  <div>

                    <label>
                      Project
                    </label>

                    <select
                      value={
                        selectedLead.project ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedLead(
                          (prev) => ({
                            ...prev,
                            project:
                              e.target.value
                          })
                        )
                      }
                    >

                      <option value="">
                        Select Project
                      </option>

                      {projectOptions.map(
                        (
                          project
                        ) => (

                          <option
                            key={
                              project
                            }
                            value={
                              project
                            }
                          >
                            {project}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* SOURCE */}

                  <div>

                    <label>
                      Source
                    </label>

                    <select
                      value={
                        selectedLead.source ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedLead(
                          (prev) => ({
                            ...prev,
                            source:
                              e.target.value
                          })
                        )
                      }
                    >

                      <option value="">
                        Select Source
                      </option>

                      {sourceOptions.map(
                        (
                          source
                        ) => (

                          <option
                            key={
                              source
                            }
                            value={
                              source
                            }
                          >
                            {source}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* DEPARTMENT */}

                  <div>

                    <label>
                      Department
                    </label>

                    <select
                      value={
                        selectedLead.department ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedLead(
                          (prev) => ({
                            ...prev,
                            department:
                              e.target.value
                          })
                        )
                      }
                    >

                      <option value="">
                        Please Select Department
                      </option>

                      {departmentOptions.map(
                        (
                          department
                        ) => (

                          <option
                            key={
                              department
                            }
                            value={
                              department
                            }
                          >
                            {department}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* NEXT CALL DATE */}

                  <div>

                    <label>
                      Next Call Date
                    </label>

                    <input
                      type="date"
                      value={
                        selectedLead.next_call_date ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedLead(
                          (prev) => ({
                            ...prev,
                            next_call_date:
                              e.target.value
                          })
                        )
                      }
                    />

                  </div>

                </div>

                {/* DESCRIPTION */}

                <textarea
                  placeholder="Comment"
                  rows="4"
                  value={
                    selectedLead.description ||
                    ""
                  }
                  onChange={(e) =>
                    setSelectedLead(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target.value
                      })
                    )
                  }
                />

                {/* ACTIONS */}

                <div className="modal-actions">

                  <button
                    className="cancel-btn"
                    onClick={() => {

                      setShowModal(
                        false
                      );

                      setSelectedLead(
                        null
                      );

                    }}
                  >

                    Cancel

                  </button>

                  <button
                    className="save-btn"
                    onClick={
                      handleUpdateLead
                    }
                  >

                    Save

                  </button>

                </div>

              </div>

            </div>

          )}

        {/* =================================================
            BOOKING MODAL
        ================================================== */}

        {showBookingModal && (

          <div className="modal-overlay">

            <div className="modal-box">

              <h3>
                Add Booking
              </h3>

              <input
                type="text"
                placeholder="Unit No"
                value={
                  bookingData.unitNo
                }
                onChange={(e) =>
                  setBookingData(
                    (prev) => ({
                      ...prev,
                      unitNo:
                        e.target.value
                    })
                  )
                }
              />

              <input
                type="number"
                placeholder="Booking Amount"
                value={
                  bookingData.bookingAmount
                }
                onChange={(e) =>
                  setBookingData(
                    (prev) => ({
                      ...prev,
                      bookingAmount:
                        e.target.value
                    })
                  )
                }
              />

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowBookingModal(
                      false
                    );

                    setBookingData({
                      unitNo: "",
                      bookingAmount:
                        ""
                    });

                  }}
                >

                  Cancel

                </button>

                <button
                  className="save-btn"
                  onClick={
                    handleCreateBooking
                  }
                >

                  Save Booking

                </button>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            CALL MODAL
        ================================================== */}

        {callModal &&
          activeCall && (

            <div className="modal-overlay">

              <div className="modal-box">

                <h3>
                  Call In Progress
                </h3>

                <p>

                  <strong>
                    Name:
                  </strong>{" "}
                  {activeCall.name ||
                    "-"}

                </p>

                <p>

                  <strong>
                    Phone:
                  </strong>{" "}
                  {activeCall.phone ||
                    "-"}

                </p>

                <p>

                  <strong>
                    Duration:
                  </strong>{" "}
                  {callDuration ||
                    "0 sec"}

                </p>

                <button
                  className="save-btn"
                  onClick={() => {

                    setCallModal(
                      false
                    );

                    setCallDuration(
                      ""
                    );

                    setCallStartTime(
                      null
                    );

                    setActiveCall(
                      null
                    );

                  }}
                >

                  Close

                </button>

              </div>

            </div>

          )}

      </div>

    </div>
  );
}